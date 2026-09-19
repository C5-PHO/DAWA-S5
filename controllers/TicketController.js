const TicketService = require("../services/TicketService");
const service = new TicketService();

exports.create = (req, res, next) => {
  try {
    const ticket = service.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.list = (req, res, next) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    res.status(200).json(service.list(page, limit));
  } catch (error) {
    next(error);
  }
};

exports.assign = (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req.body;
    const ticket = service.assignTicket(id, user);
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.changeStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ticket = service.changeStatus(id, status);
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

exports.delete = (req, res, next) => {
  try {
    service.deleteTicket(req.params.id);
    res.json({ message: "Ticket eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

exports.notifications = (req, res, next) => {
  try {
    const notifications = service.getNotifications(req.params.id);
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};
