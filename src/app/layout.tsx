import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:  "Agora NS | Find Trusted Home Service Pros in Nova Scotia",
    template: "%s | Agora NS",
  },
  description:
    "Agora NS is Nova Scotia's AI-powered marketplace for verified home service professionals. Our 50/30/20 trust algorithm combines Google, Reddit, and BBB data so you hire with confidence.",
  keywords: [
    "plumber Nova Scotia",
    "electrician Halifax",
    "verified tradespeople NS",
    "home services Nova Scotia",
    "Agora NS",
    "trusted contractors Nova Scotia",
    "AI trust score",
  ],
  openGraph: {
    type:        "website",
    locale:      "en_CA",
    url:         "https://agorans.ca",
    siteName:    "Agora NS",
    title:       "Agora NS | Trusted Home Service Pros",
    description: "597+ verified home service professionals across Nova Scotia. Search by postal code.",
  },
  robots: {
    index:     true,
    follow:    true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: "https://agorans.ca" },
};

const localBusinessSchema = {
  "@context":   "https://schema.org",
  "@type":      "LocalBusiness",
  name:         "Agora NS",
  description:  "Nova Scotia's AI-powered marketplace for verified home service professionals.",
  url:          "https://agorans.ca",
  areaServed:   { "@type": "State", name: "Nova Scotia" },
  serviceType:  ["Plumbing", "Electrical", "General Contracting", "Painting"],
  address: {
    "@type":           "PostalAddress",
    addressRegion:     "NS",
    addressCountry:    "CA",
    addressLocality:   "Halifax",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${merriweather.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
