"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "./email";

export async function sendMarketingCampaign(formData: FormData) {
  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;
  const segment = formData.get("segment") as string;

  if (!subject || !content) {
    return { success: false, error: "Asunto y contenido son obligatorios." };
  }

  const supabase = await createClient();
  let query = supabase.from("profiles").select("email");

  // Filtering based on segment if needed
  if (segment === "Solo Leads (No matriculados)") {
    query = query.eq("role", "student"); // Assuming leads are students not yet enrolled (or another role)
    // You might want to refine this based on your database schema
  } else if (segment === "Solo Alumnos Matriculados") {
    query = query.eq("role", "student");
  }

  const { data: users, error } = await query;

  if (error || !users || users.length === 0) {
    return { success: false, error: "No se encontraron destinatarios." };
  }

  const emails = users.map(u => u.email).filter(Boolean);

  // Generamos un HTML simple
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #243B78;">Academia San Pedro</h2>
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
        <p>${content.replace(/\n/g, "<br>")}</p>
      </div>
      <p style="font-size: 12px; color: #999; margin-top: 20px; text-align: center;">
        Este es un mensaje automático de Academia San Pedro.
      </p>
    </div>
  `;

  // Envía el correo usando la función de nodemailer
  const result = await sendEmail(emails, subject, htmlContent);
  return result;
}
