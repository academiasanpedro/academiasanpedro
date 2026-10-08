import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | Academia San Pedro",
};

export default function CookiesPage() {
  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-8">Política de Cookies</h1>

      <p>
        Esta página web utiliza cookies propias y de terceros para asegurar su
        correcto funcionamiento y mejorar nuestros servicios mediante el análisis de
        sus hábitos de navegación.
      </p>

      <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">1. ¿Qué son las cookies?</h2>
      <p>
        Una cookie es un fichero que se descarga en su ordenador o dispositivo móvil
        al acceder a determinadas páginas web. Las cookies permiten a una página web,
        entre otras cosas, almacenar y recuperar información sobre los hábitos de
        navegación de un usuario o de su equipo y, dependiendo de la información que
        contengan, pueden utilizarse para reconocer al usuario.
      </p>

      <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">2. Tipos de Cookies que utilizamos</h2>
      <ul className="list-disc pl-5 space-y-2 mt-4">
        <li>
          <strong>Cookies Técnicas (Necesarias):</strong> Son aquéllas que permiten al
          usuario la navegación a través de la página web y la utilización de las
          diferentes opciones o servicios que en ella existen, como, por ejemplo,
          identificar la sesión de usuario (login), acceder al panel del alumno, o
          recordar el estado del test de nivel. (Supabase Auth utiliza cookies técnicas seguras).
        </li>
        <li>
          <strong>Cookies de Análisis:</strong> Son aquéllas que, tratadas por nosotros o
          por terceros, nos permiten cuantificar el número de usuarios y así realizar
          la medición y análisis estadístico de la utilización que hacen los usuarios
          del servicio ofertado.
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">3. Gestión de las Cookies</h2>
      <p>
        El usuario puede permitir, bloquear o eliminar las cookies instaladas en su
        equipo mediante la configuración de las opciones del navegador instalado en su
        ordenador.
      </p>
      <ul className="list-disc pl-5 space-y-2 mt-4">
        <li>En Google Chrome: Configuración &gt; Privacidad y seguridad &gt; Cookies.</li>
        <li>En Mozilla Firefox: Opciones &gt; Privacidad &amp; Seguridad.</li>
        <li>En Safari: Preferencias &gt; Privacidad.</li>
      </ul>
      <p className="mt-4">
        Tenga en cuenta que si bloquea las cookies técnicas necesarias, es posible que
        ciertas áreas de la plataforma (como el panel de alumno) no funcionen
        correctamente.
      </p>
    </>
  );
}
