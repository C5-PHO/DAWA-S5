const { v4: uuidv4 } = require("uuid");
const TicketRepository = require("../repositories/TicketRepository");
const NotificationService = require("./NotificationService");
const AppError = require("../errors/AppError");

class TicketService {
  constructor() {
    this.repo = new TicketRepository();
    this.notificationService = new NotificationService();
  }

  createTicket(data = {}) {
    const title = typeof data.title === "string" ? data.title.trim() : "";
    const description = typeof data.description === "string"
      ? data.description.trim()
      : "";

    if (!title || !description) {
      throw new AppError("El título y la descripción son obligatorios", 400);
    }

    const ticket = {
      id: uuidv4(),
      title,
      description,
      status: "nuevo",
      priority: data.priority || "medium",
      assignedUser: null
    };

    this.repo.save(ticket);
    this.notificationService.create("email", `Nuevo ticket creado: ${ticket.title}`, ticket.id);

    return ticket;
  }

  assignTicket(id, user) {
    const assignedUser = typeof user === "string" ? user.trim() : "";

    if (!assignedUser) {
      throw new AppError("El usuario es obligatorio", 400);
    }

    const ticket = this.repo.update(id, { assignedUser });
    if (!ticket) {
      throw new AppError("Ticket no encontrado", 404);
    }

    this.notificationService.create("email", `El ticket ${ticket.id} fue asignado a ${assignedUser}`, ticket.id);
    return ticket;
  }

  changeStatus(id, newStatus) {
    const status = typeof newStatus === "string" ? newStatus.trim() : "";

    if (!status) {
      throw new AppError("El estado es obligatorio", 400);
    }

    const ticket = this.repo.update(id, { status });
    if (!ticket) {
      throw new AppError("Ticket no encontrado", 404);
    }

    this.notificationService.create("push", `El ticket ${ticket.id} cambió a ${status}`, ticket.id);
    return ticket;
  }

  list(page = 1, limit = 5) {
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      throw new AppError("El parámetro page debe ser un entero mayor a 0", 400);
    }

    if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
      throw new AppError("El parámetro limit debe ser un entero mayor a 0", 400);
    }

    const tickets = this.repo.findAll();
    const start = (parsedPage - 1) * parsedLimit;

    return {
      data: tickets.slice(start, start + parsedLimit),
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total: tickets.length,
        totalPages: Math.ceil(tickets.length / parsedLimit)
      }
    };
  }

  getNotifications(id) {
    const ticket = this.repo.findById(id);

    if (!ticket) {
      throw new AppError("Ticket no encontrado", 404);
    }

    return this.notificationService.listByTicketId(id);
  }

  deleteTicket(id) {
    const deleted = this.repo.delete(id);
    if (!deleted) {
      throw new AppError("Ticket no encontrado", 404);
    }
    return true;
  }
}

module.exports = TicketService;

