import { getContent } from "@/lib/content";
import { ContentProvider } from "@/components/providers/ContentProvider";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Loader from "@/components/ui/Loader";
import Cursor from "@/components/ui/Cursor";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import JsonLd from "@/components/JsonLd";
import { organizationGraph } from "@/lib/structured-data";
import Analytics from "@/components/Analytics";
import { isValidGtmId } from "@/lib/analytics";

// Analytics only on the real production site — not in development or automated tests.
const analyticsOn = process.env.NODE_ENV === "production" && !process.env.DISABLE_ANALYTICS && !process.env.LOCAL_CONTENT_DIR;

export default async function SiteLayout({ children }) {
  const content = await getContent();
  const gtmId = analyticsOn && isValidGtmId(content.seo?.gtmId) ? content.seo.gtmId.trim() : null;
  const clarityId = analyticsOn ? content.seo?.clarityId : null;
  return (
    <ContentProvider content={content}>
      {gtmId && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
      )}
      <Analytics gtmId={gtmId} clarityId={clarityId} />
      <noscript>
        <style>{`html.is-loading,html.is-loading body{overflow:auto!important}#mo-loader{display:none!important}`}</style>
      </noscript>
      <JsonLd data={organizationGraph(content)} />
      <SmoothScroll />
      <Loader />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </ContentProvider>
  );
}
