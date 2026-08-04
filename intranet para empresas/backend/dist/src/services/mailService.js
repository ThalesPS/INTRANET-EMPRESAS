"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.MailService = {
    async sendInvoiceReminder(to, name, mesCompetencia) {
        const host = process.env.SMTP_HOST;
        const port = parseInt(process.env.SMTP_PORT || '587', 10);
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;
        const from = process.env.SMTP_FROM || '"Neon Flow" <noreply@neonflow.com.br>';
        const subject = `Lembrete: Envio de Nota Fiscal - ${mesCompetencia}`;
        const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; margin-bottom: 16px;">Lembrete de Nota Fiscal</h2>
        <p style="color: #334155; font-size: 16px; line-height: 24px;">Olá, <strong>${name}</strong>!</p>
        <p style="color: #334155; font-size: 16px; line-height: 24px;">
          Este é um lembrete automático para que você realize o envio da sua <strong>Nota Fiscal de competência ${mesCompetencia}</strong>.
        </p>
        <p style="color: #334155; font-size: 16px; line-height: 24px;">
          Por favor, acesse a intranet corporativa no menu <strong>"Minhas Notas"</strong> para fazer o upload do documento (PDF ou XML).
        </p>
        <p style="color: #e11d48; font-size: 14px; font-weight: bold; margin-top: 20px;">
          * Envie a nota o quanto antes para que possamos processar o seu pagamento sem atrasos.
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #64748b; font-size: 12px;">Este é um e-mail automático enviado pelo sistema de Intranet Neon Flow. Favor não responder.</p>
      </div>
    `;
        if (host && user && pass) {
            console.log(`[MailService] Enviando e-mail real de cobrança para ${to}...`);
            const transporter = nodemailer_1.default.createTransport({
                host,
                port,
                secure: port === 465,
                auth: {
                    user,
                    pass,
                },
            });
            await transporter.sendMail({
                from,
                to,
                subject,
                html,
            });
            console.log(`[MailService] E-mail enviado com sucesso para ${to}.`);
        }
        else {
            console.log(`\n==================================================`);
            console.log(`[MailService] MODO SIMULAÇÃO (Configuração de SMTP ausente no .env)`);
            console.log(`Para: ${to}`);
            console.log(`Assunto: ${subject}`);
            console.log(`Mensagem: Lembrete para envio de nota fiscal de competência ${mesCompetencia}.`);
            console.log(`==================================================\n`);
        }
    }
};
