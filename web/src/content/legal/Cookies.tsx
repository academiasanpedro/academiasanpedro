// Texto por defecto de la Política de Cookies (se sustituye desde /admin/legal)
// La web solo usa cookies técnicas de sesión (Supabase Auth): no requieren banner de consentimiento.

export default function Cookies() {
  return (
    <>
      <p>
        Una cookie es un pequeño fichero que se guarda en tu navegador al visitar una web y que permite, entre otras
        cosas, recordar tu sesión.
      </p>

      <h2>1. Cookies que utilizamos</h2>
      <p>
        Esta web utiliza únicamente <strong>cookies técnicas necesarias</strong>, propias, para mantener la sesión
        iniciada en el área de alumnos y en el panel de administración (proveedor: Supabase Auth). No utilizamos cookies
        de análisis, publicidad ni seguimiento.
      </p>
      <p>
        Según el artículo 22.2 de la LSSI-CE, estas cookies están exentas de consentimiento porque son imprescindibles
        para prestar el servicio que solicitas.
      </p>

      <h2>2. Cómo gestionarlas</h2>
      <p>Puedes eliminar o bloquear las cookies desde la configuración de tu navegador:</p>
      <ul>
        <li>Google Chrome: Configuración › Privacidad y seguridad › Cookies.</li>
        <li>Mozilla Firefox: Ajustes › Privacidad y seguridad.</li>
        <li>Safari: Ajustes › Privacidad.</li>
      </ul>
      <p>Si las bloqueas, no podrás iniciar sesión en el área de alumnos.</p>

      <h2>3. Cambios</h2>
      <p>Si en el futuro incorporamos otras cookies, actualizaremos esta política y solicitaremos tu consentimiento.</p>
    </>
  );
}
