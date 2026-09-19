const { v4: uuidv4 } = require("uuid");
const NotificationRepository = require("../repositories/NotificationRepository");
const EmailService = require("./EmailService");

class NotificationService {
  constructor() {
    this.repo = new NotificationRepository();
    this.emailService = new EmailService();
  }

  create(type, message, ticketId) {
    const notification = {
      id: uuidv4(),
      type,
      message,
      status: "pending",
      ticketId
    };

    const savedNotification = this.repo.save(notification);

    if (type === "email") {
      const recipient = process.env.MAILER_TO || process.env.MAILER_EMAIL;

      this.emailService.sendEmail({
        to: recipient,
        subject: "API RESTful - Alertas del sistema de Tickets",
        htmlBody: `<h1>${message}</h1>`
      }).then((sent) => {
        this.repo.update(notification.id, {
          status: sent ? "sent" : "failed"
        });
      }).catch((error) => {
        console.error("Error procesando la notificación:", error.message);
        this.repo.update(notification.id, { status: "failed" });
      });
    }

    return savedNotification;
  }

  list() {
    return this.repo.findAll();
  }
}
module.exports = NotificationService;
