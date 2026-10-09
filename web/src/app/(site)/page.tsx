// Landing — Ruta: /
// Ref: AcademiaSanPedro/02_Business.md · 04_Routes.md (anclas)

import Contact from "@/components/landing/Contact";
import Courses from "@/components/landing/Courses";
import Exams from "@/components/landing/Exams";
import Faq from "@/components/landing/Faq";
import FinalCta from "@/components/landing/FinalCta";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Languages from "@/components/landing/Languages";
import Method from "@/components/landing/Method";
import Testimonials from "@/components/landing/Testimonials";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LanguageSchool",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logo.png`,
  image: `${SITE_URL}/assets/logo_letras.png`,
  telephone: "+34 610 93 25 78",
  email: CONTACT.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.address,
    postalCode: CONTACT.postalCode,
    addressLocality: CONTACT.city,
    addressRegion: "Andalucía",
    addressCountry: "ES",
  },
  sameAs: [CONTACT.instagram, CONTACT.facebook],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    opens: "16:00",
    closes: "20:30",
  },
  knowsLanguage: ["en", "fr", "de", "it", "es"],
  description:
    "Academia de idiomas en Huelva y Centro Preparador Oficial Cambridge. Inglés, francés, alemán e italiano para todas las edades.",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Datos estáticos propios: seguro serializar
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <Languages />
      <HowItWorks />
      <Courses />
      <Exams />
      <Method />
      <Testimonials />
      <Faq />
      <Contact />
      <FinalCta />
    </>
  );
}
