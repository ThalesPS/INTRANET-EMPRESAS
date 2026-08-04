"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.RoleController = {
    async index(req, res) {
        try {
            const roles = await prisma.companyRole.findMany({
                orderBy: { name: 'asc' }
            });
            res.json(roles);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao listar cargos' });
        }
    },
    async create(req, res) {
        try {
            const { name, currentUserRole } = req.body;
            if (!['Desenvolvedor', 'RH'].includes(currentUserRole)) {
                return res.status(403).json({ error: 'Sem permissão para criar cargos.' });
            }
            if (!name) {
                return res.status(400).json({ error: 'O nome do cargo é obrigatório.' });
            }
            const existingRole = await prisma.companyRole.findUnique({
                where: { name }
            });
            if (existingRole) {
                return res.status(400).json({ error: 'Este cargo já existe.' });
            }
            const newRole = await prisma.companyRole.create({
                data: { name }
            });
            res.status(201).json(newRole);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao criar cargo' });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, currentUserRole } = req.body;
            if (!['Desenvolvedor', 'RH'].includes(currentUserRole)) {
                return res.status(403).json({ error: 'Sem permissão para editar cargos.' });
            }
            if (!name) {
                return res.status(400).json({ error: 'O nome do cargo é obrigatório.' });
            }
            const updatedRole = await prisma.companyRole.update({
                where: { id },
                data: { name }
            });
            res.json(updatedRole);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao editar cargo' });
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.params;
            const { currentUserRole } = req.body;
            if (!['Desenvolvedor', 'RH'].includes(currentUserRole)) {
                return res.status(403).json({ error: 'Sem permissão para excluir cargos.' });
            }
            await prisma.companyRole.delete({ where: { id } });
            res.json({ message: 'Cargo excluído com sucesso.' });
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao excluir cargo' });
        }
    }
};
