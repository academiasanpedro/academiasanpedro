// Contacto — datos reales + formulario
// Ref: AcademiaSanPedro/02_Business.md → Identidad

import { Mail, MapPin, Phone } from "lucide-react";
import Instagram from "@/components/ui/InstagramIcon";
import ContactForm from "@/components/features/ContactForm";
import SectionHeading from "@/components/ui/SectionHeading";
import { CONTACT } from "@/lib/constants";

const CHANNELS = [
  { icon: Phone, label: "Llámanos", value: CONTACT.phone, href: CONTACT.phoneHref },
  { icon: Mail, label: "Escríbenos", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: MapPin, label: "Visítanos", value: `${CONTACT.address}, ${CONTACT.city}`, href: CONTACT.mapsUrl, external: true },
  { icon: Instagram, label: "Síguenos", value: CONTACT.instagramHandle, href: CONTACT.instagram, external: true },
];

export default function Contact() {
  return (
    <section id="contacto" className="bg-neutral-50 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_1.3fr] lg:px-8">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Contacto"
            title="Hablemos de tu objetivo"
            description="Cuéntanos qué necesitas y te orientamos sin compromiso sobre el curso, el horario o el examen que mejor encaja contigo."
          />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {CHANNELS.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4 rounded-2xl border border-neutral-200/70 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-soft"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary transition group-hover:bg-primary group-hover:text-white">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold tracking-wider text-neutral-400 uppercase">{label}</span>
                    <span className="block truncate font-bold text-neutral-900">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] border border-neutral-200/70 bg-white p-6 shadow-soft sm:p-10">
          <h3 className="text-2xl font-black tracking-tight text-neutral-900">Solicita información</h3>
          <p className="mt-2 mb-8 text-neutral-500">Te responderemos por email o por teléfono.</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
