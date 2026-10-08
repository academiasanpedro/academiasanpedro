// Texto por defecto del Aviso Legal (se sustituye desde /admin/legal)
// Pendiente: titular y NIF (ver 06_Backlog)

import { CONTACT, SITE_URL } from "@/lib/constants";

export default function AvisoLegal() {
  return (
    <>
      <p>
        El presente aviso legal regula el uso del sitio web de la Academia de Idiomas San Pedro, accesible en{" "}
        <a href={SITE_URL}>{SITE_URL.replace(/^https?:\/\//, "")}</a>.
      </p>

      <h2>1. Datos identificativos</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y del Comercio
        Electrónico (LSSI-CE), se facilitan los siguientes datos:
      </p>
      <ul>
        <li>
          <strong>Titular:</strong> [Razón social o nombre del titular]
        </li>
        <li>
          <strong>NIF/CIF:</strong> [NIF/CIF]
        </li>
        <li>
          <strong>Domicilio:</strong> {CONTACT.address}, {CONTACT.postalCode} {CONTACT.city}
        </li>
        <li>
          <strong>Correo electrónico:</strong> <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </li>
        <li>
          <strong>Teléfono:</strong> {CONTACT.phone}
        </li>
      </ul>

      <h2>2. Usuarios</h2>
      <p>
        El acceso y uso de este sitio web atribuye la condición de usuario, que acepta las condiciones generales de uso
        aquí reflejadas.
      </p>

      <h2>3. Uso del sitio web</h2>
      <p>
        El usuario se compromete a hacer un uso adecuado de los contenidos y servicios (registro, cuestionario, test de
        nivel y formulario de contacto) y a facilitar datos veraces.
      </p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        El titular es propietario o cuenta con licencia de todos los derechos de propiedad intelectual e industrial del
        sitio web y de sus contenidos (textos, imágenes, logotipos, diseño, código, etc.). Queda prohibida su
        reproducción, distribución o comunicación pública con fines comerciales sin autorización expresa.
      </p>

      <h2>5. Responsabilidad</h2>
      <p>
        El titular no se hace responsable de los daños derivados del uso indebido del sitio web ni de interrupciones del
        servicio ajenas a su control.
      </p>
    </>
  );
}
