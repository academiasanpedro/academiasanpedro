import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Academia San Pedro",
};

export default function PrivacidadPage() {
  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-8">Política de Privacidad</h1>

      <p>
        En Academia de Idiomas San Pedro estamos comprometidos con la protección y la
        seguridad de los datos de carácter personal que los usuarios nos confían. Esta
        Política de Privacidad describe cómo recopilamos, usamos y protegemos su
        información en cumplimiento con el Reglamento General de Protección de Datos
        (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos
        Personales y garantía de los derechos digitales.
      </p>

      <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">1. Responsable del Tratamiento</h2>
      <ul className="list-disc pl-5 space-y-2 mt-4">
        <li><strong>Titular:</strong> [Nombre de la empresa]</li>
        <li><strong>NIF:</strong> [NIF/CIF]</li>
        <li><strong>Dirección:</strong> [Dirección completa]</li>
        <li><strong>Correo electrónico:</strong> [Email de Privacidad/Contacto]</li>
      </ul>

      <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">2. Finalidad del Tratamiento</h2>
      <p>
        Recogemos y tratamos los datos personales con las siguientes finalidades:
      </p>
      <ul className="list-disc pl-5 space-y-2 mt-4">
        <li>Gestionar la creación de su cuenta de alumno.</li>
        <li>Realizar evaluaciones de nivel y enviar los resultados de las pruebas.</li>
        <li>Comunicarnos con usted para responder a consultas y proporcionar soporte.</li>
        <li>Gestionar las matrículas, pagos e inscripción en los cursos oficiales de Cambridge.</li>
      </ul>

      <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">3. Conservación de Datos</h2>
      <p>
        Los datos personales proporcionados se conservarán mientras se mantenga la relación
        contractual o académica y no se solicite su supresión por el interesado, y
        durante el plazo por el cuál pudieran derivarse responsabilidades legales por
        los servicios prestados.
      </p>

      <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">4. Derechos de los Usuarios</h2>
      <p>
        Puede ejercer en cualquier momento sus derechos de acceso, rectificación,
        supresión, limitación, oposición y portabilidad de sus datos enviando un correo
        electrónico a [Email de Privacidad], acompañando copia de su DNI u otro documento
        oficial que le identifique.
      </p>
    </>
  );
}
