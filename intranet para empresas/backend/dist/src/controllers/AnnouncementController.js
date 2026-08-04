"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.AnnouncementController = {
    // GET /announcements - Listar avisos
    async index(req, res) {
        try {
            const announcements = await prisma.announcement.findMany({
                orderBy: { createdAt: 'desc' }
            });
            res.json(announcements);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao listar avisos' });
        }
    },
    // POST /announcements - Criar aviso
    async create(req, res) {
        try {
            const { title, content, category, author, currentUserRole } = req.body;
            if (!['Desenvolvedor', 'RH'].includes(currentUserRole)) {
                return res.status(403).json({ error: 'Apenas desenvolvedores e RH podem criar avisos' });
            }
            const announcement = await prisma.announcement.create({
                data: { title, content, category, author }
            });
            res.status(201).json(announcement);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao criar aviso' });
        }
    },
    // GET /announcements/stats - Estatísticas para o Dashboard
    async stats(req, res) {
        try {
            const totalUsers = await prisma.user.count();
            const totalTickets = await prisma.ticket.count();
            const openTickets = await prisma.ticket.count({ where: { status: 'aberto' } });
            const waitingTickets = await prisma.ticket.count({ where: { status: 'aguardando' } });
            const resolvedTickets = await prisma.ticket.count({ where: { status: 'concluido' } });
            const recentAnnouncements = await prisma.announcement.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' }
            });
            res.json({
                users: totalUsers,
                tickets: {
                    total: totalTickets,
                    open: openTickets,
                    waiting: waitingTickets,
                    resolved: resolvedTickets
                },
                recentAnnouncements
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao buscar estatísticas' });
        }
    }
};
