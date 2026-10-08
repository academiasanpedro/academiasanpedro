"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "./email";

export async function evaluateTestAndSendEmail(testId: string, email: string, level: string, notes: string) {
  const supabase = await createClient();
  
  // 1. Marcar el test como evaluado
  const { error: updateError } = await supabase
    .from("level_tests")
    .update({ status: "evaluated", assigned_level: level })
    .eq("id", testId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // 2. Enviar el correo
  const subject = "Resultado de tu Test de Nivel - Academia San Pedro";
  const html = `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #243B78;">Academia San Pedro</h2>
      <p>¡Hola! Hemos revisado tu test de nivel.</p>
      
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #243B78;">Tu Nivel Asignado: <strong>${level}</strong></h3>
        ${notes ? `<p><strong>Observaciones:</strong><br/>${notes}</p>` : ''}
      </div>
      
      <p>Entra en tu panel de control para ver más detalles y comenzar a reservar tus clases.</p>
      <p>¡Te esperamos!</p>
    </div>
  `;

  const result = await sendEmail(email, subject, html);

  if (!result.success) {
    return { success: false, error: "Test evaluado, pero falló el envío de correo: " + result.error };
  }

  return { success: true };
}
