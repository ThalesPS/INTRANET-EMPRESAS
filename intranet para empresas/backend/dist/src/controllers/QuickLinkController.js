"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickLinkController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.QuickLinkController = {
    async index(req, res) {
        try {
            const links = await prisma.quickLink.findMany({
                orderBy: { createdAt: 'asc' }
            });
            res.json(links);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao listar links rápidos' });
        }
    },
    async create(req, res) {
        try {
            const { label, url, currentUserRole } = req.body;
            if (!['Desenvolvedor', 'RH'].includes(currentUserRole)) {
                return res.status(403).json({ error: 'Apenas desenvolvedores e RH podem criar links.' });
            }
            if (!label || !url) {
                return res.status(400).json({ error: 'Label e URL são obrigatórios.' });
            }
            const newLink = await prisma.quickLink.create({
                data: { label, url }
            });
            res.status(201).json(newLink);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao criar link' });
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.params;
            const { currentUserRole } = req.body;
            if (!['Desenvolvedor', 'RH'].includes(currentUserRole)) {
                return res.status(403).json({ error: 'Apenas desenvolvedores e RH podem excluir links.' });
            }
            await prisma.quickLink.delete({ where: { id } });
            res.json({ message: 'Link excluído com sucesso.' });
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao excluir link' });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            const { label, url, currentUserRole } = req.body;
            if (!['Desenvolvedor', 'RH'].includes(currentUserRole)) {
                return res.status(403).json({ error: 'Apenas desenvolvedores e RH podem editar links.' });
            }
            if (!label || !url) {
                return res.status(400).json({ error: 'Label e URL são obrigatórios.' });
            }
            const updatedLink = await prisma.quickLink.update({
                where: { id },
                data: { label, url }
            });
            res.json(updatedLink);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao editar link' });
        }
    }
};
