import { BrevoClient } from "@getbrevo/brevo";

const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY ?? "" });

export async function sendEmailCode(
  to: string,
  code: string,
  reason: "verify" | "change-email" | "change-password" | "reset-password"
) {
  const subjects: Record<typeof reason, string> = {
    "verify":          "Confirme seu e-mail — Descarte Certo",
    "change-email":    "Alteração de e-mail — Descarte Certo",
    "change-password": "Alteração de senha — Descarte Certo",
    "reset-password":  "Recuperação de senha — Descarte Certo",
  };

  const intros: Record<typeof reason, string> = {
    "verify":          "Para confirmar seu e-mail, use o código abaixo:",
    "change-email":    "Você solicitou a alteração do seu e-mail. Use o código abaixo para confirmar:",
    "change-password": "Você solicitou a alteração da sua senha. Use o código abaixo para confirmar:",
    "reset-password":  "Você solicitou a recuperação da sua senha. Use o código abaixo para redefinir:",
  };

  await client.transactionalEmails.sendTransacEmail({
    subject:     subjects[reason],
    sender:      { name: "Descarte Certo", email: "andreyrdh@gmail.com" },
    to:          [{ email: to }],
    htmlContent: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
        <h2 style="color:#22c55e;margin-bottom:8px;">Descarte Certo</h2>
        <p style="color:#475569;margin-bottom:24px;">${intros[reason]}</p>
        <div style="background:#f0fdf4;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:36px;font-weight:900;letter-spacing:8px;color:#1e293b;">${code}</span>
        </div>
        <p style="color:#94a3b8;font-size:13px;">Este código expira em 15 minutos. Se não foi você, ignore este e-mail.</p>
      </div>
    `,
  });
}
