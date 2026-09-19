const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ quiet: true });

class EmailService {
  constructor() {
    const { MAILER_SERVICE, MAILER_EMAIL, MAILER_SECRET_KEY } = process.env;

    if (!MAILER_SERVICE || !MAILER_EMAIL || !MAILER_SECRET_KEY) {
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      service: MAILER_SERVICE,
      auth: {
        user: MAILER_EMAIL,
        pass: MAILER_SECRET_KEY,
      },
      tls: {
        rejectUnauthorized: true,
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });
  }

  async sendEmail(options) {
    const { to, subject, htmlBody } = options;

    if (!this.transporter) {
      console.error("No se envió el email: faltan variables de correo en el archivo .env");
      return false;
    }

    if (!to) {
      console.error("No se envió el email: falta el destinatario MAILER_TO");
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: process.env.MAILER_EMAIL,
        to,
        subject,
        html: htmlBody,
      });

      console.log("Email enviado:", info.response);
      return true;
    } catch (error) {
      console.error("Error enviando el email:", error.message);
      return false;
    }
  }
}

module.exports = EmailService;
