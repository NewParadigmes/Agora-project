import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Note: We use SUPABASE_SERVICE_ROLE_KEY if available to bypass RLS during cron insertions.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  // 1. Secure the Route: Authorization: Bearer ${process.env.CRON_SECRET}
  const authHeader = req.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Fetch Businesses
    const { data: businesses, error: dbError } = await supabase
      .from('businesses')
      .select('id, name');

    if (dbError) {
      console.error('Error fetching businesses:', dbError);
      return NextResponse.json({ error: 'Failed to fetch businesses' }, { status: 500 });
    }

    if (!businesses || businesses.length === 0) {
      return NextResponse.json({ message: 'No businesses found to check.' });
    }

    const mentionsToInsert = [];

    // 3. Search Reddit
    for (const business of businesses) {
      if (!business.name) continue;
      
      const searchQuery = encodeURIComponent(business.name);
      const subreddits = ['halifax', 'NovaScotia'];
      
      for (const sub of subreddits) {
        const url = `https://www.reddit.com/r/${sub}/search.json?q=${searchQuery}&restrict_sr=1&sort=new`;
        
        try {
          const response = await fetch(url, {
            headers: {
              // User-Agent is strictly required by Reddit's API guidelines
              'User-Agent': 'AgoraMarketplaceBot/1.0.0 (Next.js Cron Check)'
            }
          });

          if (!response.ok) {
            console.warn(`Reddit API returned ${response.status} for ${url}`);
            continue; // Skip safely if Reddit is down or rate limiting
          }

          const data = await response.json();
          const posts = data?.data?.children || [];

          // 4. Keyword Search Logic
          for (const postObj of posts) {
            const post = postObj.data;
            if (!post) continue;

            const title = post.title || '';
            const selftext = post.selftext || '';
            const content = `${title} ${selftext}`.toLowerCase();
            const postUrl = `https://www.reddit.com${post.permalink}`;

            let sentiment = 'neutral';
            
            // Basic logic: "good/recommend" (+) vs "avoid/bad" (-)
            const positiveWords = ['good', 'recommend', 'great', 'awesome', 'best'];
            const negativeWords = ['avoid', 'bad', 'terrible', 'worst', 'scam'];

            let posCount = 0;
            let negCount = 0;

            positiveWords.forEach(word => {
              if (content.includes(word)) posCount++;
            });
            negativeWords.forEach(word => {
              if (content.includes(word)) negCount++;
            });

            if (posCount > negCount) {
              sentiment = 'positive';
            } else if (negCount > posCount) {
              sentiment = 'negative';
            }

            mentionsToInsert.push({
              business_id: business.id,
              post_title: title,
              post_url: postUrl,
              sentiment: sentiment
            });
          }
        } catch (fetchError) {
          // Error Handling: Ensure script doesn't crash if Reddit is down
          console.error(`Error fetching Reddit for ${business.name} in r/${sub}:`, fetchError);
        }
      }
      
      // Artificial delay to respect Reddit's API rate limits (avoiding 429 Too Many Requests)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 5. Save the post_title, post_url, and sentiment into the reddit_mentions table
    if (mentionsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('reddit_mentions')
        .insert(mentionsToInsert);

      if (insertError) {
        console.error('Error inserting reddit mentions:', insertError);
        return NextResponse.json({ error: 'Failed to save mentions to database', details: insertError }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      mentions_found_and_saved: mentionsToInsert.length 
    });

  } catch (error) {
    console.error('Unhandled error in reddit-check cron:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
