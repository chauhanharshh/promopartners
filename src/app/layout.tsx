import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromoPartners® Marketing | Best Digital Marketing Agency India | Brand Promotions | Influencer Marketing",
  description: "PromoPartners® — India's #1 premium digital marketing agency. Expert in Brand Promotions, Influencer Marketing, PR & Media, SEO, Social Media Ads, Photoshoots & Videoshoots. Serving Delhi, Gurgaon, Pune, Surat, Haridwar. Plans starting ₹3,999/-. 25+ brands scaled. Call +91 7668191106",
  keywords: "best digital marketing agency India, top marketing agency Delhi, influencer marketing agency India, brand promotion agency, PR media agency India, social media marketing agency, SEO agency India, marketing agency Haridwar, marketing agency Gurgaon, marketing agency Pune, promopartners, promopartners marketing, promopartnersindia, performance marketing agency, content creation agency, photoshoot videoshoot agency, restaurant marketing agency, startup marketing agency, affordable marketing agency India, marketing agency near me, digital marketing company India 2025, brand identity agency, marketing agency for restaurants, marketing for hotels, marketing for clothing brands",
  authors: [{ name: "PromoPartners Marketing" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  alternates: {
    canonical: "https://promopartnersmarketing.com"
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "Haridwar, Delhi, Gurgaon, Pune, Surat, India",
    "geo.position": "29.9457;78.1642",
    "ICBM": "29.9457, 78.1642",
    "language": "English, Hindi"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#2D3436] text-white">
        {children}
      </body>
    </html>
  );
}
