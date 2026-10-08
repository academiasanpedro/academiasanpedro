import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email || "tu correo";

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
        <Mail size={40} />
      </div>
      
      <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-4">
        Verifica tu Email
      </h1>
      
      <p className="text-neutral-500 mb-8 font-medium text-lg max-w-md mx-auto">
        Hemos enviado un correo de confirmación a <strong className="text-neutral-900">{email}</strong>. 
        <br/><br/>
        Haz clic en el enlace que te hemos enviado para activar tu cuenta y acceder automáticamente a tu panel de alumno.
      </p>

      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 max-w-sm mx-auto mb-8">
        <p className="text-sm text-neutral-500">
          ¿No lo encuentras? Revisa tu carpeta de Spam o Correo no deseado.
        </p>
      </div>

      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 font-bold text-primary hover:text-primary-dark transition-colors"
      >
        Volver al inicio de sesión <ArrowRight size={16} />
      </Link>
    </div>
  );
}
