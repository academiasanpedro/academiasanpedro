// Cursos segmentados por público
// Ref: AcademiaSanPedro/02_Business.md → Oferta y Directrices UX

import SectionHeading from "@/components/ui/SectionHeading";
import CourseTabs from "./CourseTabs";

export default function Courses() {
  return (
    <section id="cursos" className="bg-neutral-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Cursos"
          title="Un curso para cada etapa"
          description="De Playschool a mayores de 65, en grupo o individual. Elige tu perfil y descubre qué encaja contigo."
        />
        <CourseTabs />
      </div>
    </section>
  );
}
