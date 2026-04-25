import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Helper function for pacing requests to avoid rate limits
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialize Supabase client
// We use SUPABASE_SERVICE_ROLE_KEY to ensure the script has "Write" permissions to the reddit_mentions table.
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
    // 2. Fetch all business names from the Supabase businesses table.
    const { data: businesses, error: dbError } = await supabase
      .from('businesses')
      .select('id, name');

    if (dbError) {
      console.error('Error fetching businesses:', dbError);
      return NextResponse.json({ error: 'Failed to fetch businesses' }, { status: 500 });
    }

    if (!businesses || businesses.length === 0) {
      return NextResponse.json({ success: true, message: 'No businesses found to check.' });
    }

    const mentionsToUpsert = [];

    // 3. Search Reddit
    for (const business of businesses) {
      if (!business.name) continue;
      
      const searchQuery = encodeURIComponent(business.name);
      const subreddits = ['halifax', 'NovaScotia'];
      
      for (const sub of subreddits) {
        const url = `https://www.reddit.com/r/${sub}/search.json?q=${searchQuery}&restrict_sr=1&sort=new`;
        
        try {
          // Pacing: 2-second pause before every Reddit API call to prevent rate-limiting.
          await delay(2000);

          const response = await fetch(url, {
            headers: {
              // The "Anti-Bot" Fix: Specific custom User-Agent
              'User-Agent': 'AgoraMarketplace:v1.0.0 (by /u/Expensive_Peanut1164)'
            }
          });

          if (!response.ok) {
            console.warn(`Reddit API returned ${response.status} for ${url}`);
            continue; // Skip safely if Reddit is down or returning a 403/429
          }

          const data = await response.json();
          const posts = data?.data?.children || [];

          // 4. Basic sentiment check
          for (const postObj of posts) {
            const post = postObj.data;
            if (!post) continue;

            const title = post.title || '';
            const selftext = post.selftext || '';
            const content = `${title} ${selftext}`.toLowerCase();
            const postUrl = `https://www.reddit.com${post.permalink}`;

            let sentiment = 'neutral';
            
            // If the title contains "recommend" or "great," mark as positive. 
            // If it contains "avoid," "bad," or "scam," mark as negative.
            if (content.includes('recommend') || content.includes('great')) {
              sentiment = 'positive';
            } else if (content.includes('avoid') || content.includes('bad') || content.includes('scam')) {
              sentiment = 'negative';
            }

            mentionsToUpsert.push({
              business_id: business.id,
              post_title: title.substring(0, 255), // safety truncation
              post_url: postUrl,
              sentiment: sentiment
            });
          }
        } catch (fetchError) {
          // Handle errors gracefully so that one failed Reddit request doesn't crash the entire loop.
          console.error(`Error fetching Reddit for ${business.name} in r/${sub}:`, fetchError);
        }
      }
    }

    // 5. Storage: Upsert into reddit_mentions
    if (mentionsToUpsert.length > 0) {
      // Use supabase.from('reddit_mentions').upsert() to save data.
      // Use post_url as the conflict target to avoid duplicate entries.
      const { error: upsertError } = await supabase
        .from('reddit_mentions')
        .upsert(mentionsToUpsert, { onConflict: 'post_url' });

      if (upsertError) {
        console.error('Error upserting reddit mentions:', upsertError);
        // Continue and return success: false if db fails, or still return success: true but log error
        return NextResponse.json({ error: 'Failed to save mentions to database', details: upsertError }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      mentions_upserted: mentionsToUpsert.length 
    });

  } catch (error) {
    console.error('Unhandled error in reddit-check cron:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
