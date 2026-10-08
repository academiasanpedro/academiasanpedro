// Layout de las páginas públicas (landing y legales)

import SiteHeader from "@/components/layout/SiteHeader";
import Footer from "@/components/layout/Footer";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
