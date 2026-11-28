import { Montserrat, Saira_Condensed } from "next/font/google";
import "./globals.css";
import { getContent } from "@/lib/content";

const saira = Saira_Condensed({
  variable: "--font-saira",
  weight: "800",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata() {
  const { site, seo, contact } = await getContent();
  const title = `${site.name} — Study Visa Consultants in ${site.city}`;
  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s · ${site.name}` },
    description: site.description,
    keywords: [
      "study visa consultants",
      "study abroad",
      "student visa",
      "Canada study visa",
      "UK student visa",
      "Australia student visa",
      "USA F1 visa",
      "Germany study",
      "Ireland study visa",
      "New Zealand student visa",
      "IELTS coaching",
      "PTE coaching",
      site.city,
    ],
    // Each page sets its own canonical URL (see src/lib/seo.js).
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: site.name,
      title,
      description: site.description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: `${site.name} — your future has a flight path` }],
    },
    twitter: { card: "summary_large_image", title, description: site.description, images: ["/og-image.jpg"] },
    // Paste the codes from Google Search Console / Bing Webmaster in Admin → SEO.
    verification: {
      ...(seo?.googleVerification && { google: seo.googleVerification }),
      ...(seo?.bingVerification && { other: { "msvalidate.01": seo.bingVerification } }),
    },
    other: {
      "geo.region": "IN-AP",
      ...(site.city && !site.city.includes("[") && { "geo.placename": site.city }),
      ...(contact?.geo?.lat && { "geo.position": `${contact.geo.lat};${contact.geo.lng}`, ICBM: `${contact.geo.lat}, ${contact.geo.lng}` }),
    },
  };
}

export const viewport = {
  themeColor: "#12151C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${saira.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
