import { getContent } from "@/lib/content";
import { ContentProvider } from "@/components/providers/ContentProvider";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Loader from "@/components/ui/Loader";
import Cursor from "@/components/ui/Cursor";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import JsonLd from "@/components/JsonLd";

export default async function SiteLayout({ children }) {
  const content = await getContent();
  return (
    <ContentProvider content={content}>
      <noscript>
        <style>{`html.is-loading,html.is-loading body{overflow:auto!important}#mo-loader{display:none!important}`}</style>
      </noscript>
      <JsonLd content={content} />
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
