import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal | Academia San Pedro",
};

export default function AvisoLegalPage() {
  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-8">Aviso Legal</h1>
      
      <p>
        El presente aviso legal regula el uso y utilización del sitio web de la
        Academia de Idiomas San Pedro, al que se accede a través de la dirección{" "}
        <a href="/" className="text-primary hover:underline">www.academiasanpedro.com</a>.
      </p>

      <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">1. Datos Identificativos</h2>
      <p>
        En cumplimiento con el deber de información recogido en artículo 10 de la Ley
        34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del
        Comercio Electrónico, a continuación se reflejan los siguientes datos:
      </p>
      <ul className="list-disc pl-5 space-y-2 mt-4">
        <li><strong>Titular:</strong> [Nombre de la empresa o autónomo titular]</li>
        <li><strong>NIF/CIF:</strong> [CIF/NIF]</li>
        <li><strong>Dirección:</strong> [Dirección física completa]</li>
        <li><strong>Correo electrónico:</strong> [Email de contacto]</li>
        <li><strong>Teléfono:</strong> [Teléfono]</li>
      </ul>

      <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">2. Usuarios</h2>
      <p>
        El acceso y/o uso de este portal atribuye la condición de USUARIO, que acepta,
        desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas.
      </p>

      <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">3. Propiedad Intelectual e Industrial</h2>
      <p>
        El Titular, por sí o como cesionario, es titular de todos los derechos de
        propiedad intelectual e industrial de su página web, así como de los elementos
        contenidos en la misma (a título enunciativo, imágenes, sonido, audio, vídeo,
        software o textos; marcas o logotipos, combinaciones de colores, estructura y
        diseño, selección de materiales usados, etc.). Todos los derechos reservados.
      </p>
      <p>
        En virtud de lo dispuesto en los artículos 8 y 32.1, párrafo segundo, de la Ley
        de Propiedad Intelectual, quedan expresamente prohibidas la reproducción, la
        distribución y la comunicación pública, incluida su modalidad de puesta a
        disposición, de la totalidad o parte de los contenidos de esta página web, con
        fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la
        autorización del Titular.
      </p>
    </>
  );
}
