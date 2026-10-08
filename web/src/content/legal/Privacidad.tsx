// Texto por defecto de la Política de Privacidad (se sustituye desde /admin/legal)

import { CONTACT } from "@/lib/constants";

export default function Privacidad() {
  return (
    <>
      <p>
        En la Academia de Idiomas San Pedro protegemos los datos personales que nos confías, de acuerdo con el Reglamento
        (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>
          <strong>Titular:</strong> [Razón social o nombre del titular] · <strong>NIF:</strong> [NIF/CIF]
        </li>
        <li>
          <strong>Dirección:</strong> {CONTACT.address}, {CONTACT.postalCode} {CONTACT.city}
        </li>
        <li>
          <strong>Email:</strong> <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </li>
      </ul>

      <h2>2. Qué datos tratamos y para qué</h2>
      <ul>
        <li>
          <strong>Cuenta de alumno</strong> (nombre, email, teléfono opcional): gestionar tu acceso al área privada.
        </li>
        <li>
          <strong>Cuestionario y test de nivel</strong>: evaluar tu nivel, recomendarte un grupo y comunicarte el
          resultado.
        </li>
        <li>
          <strong>Formulario de contacto</strong>: responder a tu solicitud de información.
        </li>
        <li>
          <strong>Comunicaciones comerciales</strong> (ofertas, apertura de plazos): solo si lo has aceptado
          expresamente. Puedes retirarlo en cualquier momento desde tu perfil.
        </li>
      </ul>

      <h2>3. Base legal</h2>
      <p>
        Tu consentimiento al registrarte o enviar un formulario, la ejecución de la relación precontractual o académica y,
        en su caso, el cumplimiento de obligaciones legales.
      </p>

      <h2>4. Destinatarios</h2>
      <p>
        No cedemos tus datos a terceros salvo obligación legal. Utilizamos proveedores que actúan como encargados del
        tratamiento con garantías adecuadas: Supabase (alojamiento de la base de datos y autenticación) y Google
        (envío de emails).
      </p>

      <h2>5. Conservación</h2>
      <p>
        Mientras mantengas tu cuenta o la relación académica y, después, durante los plazos necesarios para atender
        posibles responsabilidades legales.
      </p>

      <h2>6. Tus derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a{" "}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. Si consideras que no hemos atendido correctamente tu
        solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          www.aepd.es
        </a>
        ).
      </p>
    </>
  );
}
