"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentController = void 0;
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
exports.DocumentController = {
    // GET /documents - Listar documentos e categorias
    async index(req, res) {
        try {
            const documents = await prisma.document.findMany({
                orderBy: { createdAt: 'desc' }
            });
            const categories = await prisma.documentCategory.findMany({
                orderBy: { name: 'asc' }
            });
            res.json({ documents, categories });
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao listar documentos' });
        }
    },
    // POST /documents - Fazer upload de documento
    async create(req, res) {
        try {
            const { category, author, currentUserRole } = req.body;
            const file = req.file;
            if (!['Desenvolvedor', 'RH'].includes(currentUserRole)) {
                return res.status(403).json({ error: 'Apenas desenvolvedores e RH podem anexar arquivos.' });
            }
            if (!file) {
                return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
            }
            const ext = path_1.default.extname(file.originalname).substring(1).toLowerCase();
            // Determine format/type icon for frontend
            let type = 'doc';
            if (['pdf'].includes(ext))
                type = 'pdf';
            else if (['xls', 'xlsx', 'csv'].includes(ext))
                type = 'xls';
            else if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext))
                type = 'img';
            else if (['zip', 'rar', '7z'].includes(ext))
                type = 'zip';
            const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
            const sizeStr = `${sizeMB} MB`;
            const document = await prisma.document.create({
                data: {
                    name: file.originalname,
                    type,
                    size: sizeStr,
                    category: category || 'Geral',
                    url: `/uploads/documentos/${file.filename}`,
                    author: author || 'Sistema'
                }
            });
            res.status(201).json(document);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao salvar documento' });
        }
    },
    // POST /documents/categories - Criar categoria (Pasta)
    async createCategory(req, res) {
        try {
            const { name, currentUserRole } = req.body;
            if (!['Desenvolvedor', 'RH'].includes(currentUserRole)) {
                return res.status(403).json({ error: 'Apenas desenvolvedores e RH podem criar pastas.' });
            }
            if (!name) {
                return res.status(400).json({ error: 'Nome da pasta é obrigatório.' });
            }
            const category = await prisma.documentCategory.create({
                data: { name }
            });
            res.status(201).json(category);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao criar pasta' });
        }
    },
    // PUT /documents/categories/:id - Editar categoria
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const { name, currentUserRole } = req.body;
            if (!['Desenvolvedor', 'RH'].includes(currentUserRole)) {
                return res.status(403).json({ error: 'Apenas desenvolvedores e RH podem editar pastas.' });
            }
            if (!name)
                return res.status(400).json({ error: 'Nome obrigatório.' });
            const oldCategory = await prisma.documentCategory.findUnique({ where: { id } });
            if (!oldCategory)
                return res.status(404).json({ error: 'Pasta não encontrada.' });
            const updatedCategory = await prisma.documentCategory.update({
                where: { id },
                data: { name }
            });
            // Update all documents that had the old category name
            await prisma.document.updateMany({
                where: { category: oldCategory.name },
                data: { category: name }
            });
            res.json(updatedCategory);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao editar pasta' });
        }
    },
    // DELETE /documents/categories/:id - Deletar categoria
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const { currentUserRole } = req.body;
            if (!['Desenvolvedor', 'RH'].includes(currentUserRole)) {
                return res.status(403).json({ error: 'Apenas desenvolvedores e RH podem deletar pastas.' });
            }
            const category = await prisma.documentCategory.findUnique({ where: { id } });
            if (!category)
                return res.status(404).json({ error: 'Pasta não encontrada.' });
            // Move documents to "Geral" before deleting
            await prisma.document.updateMany({
                where: { category: category.name },
                data: { category: 'Geral' }
            });
            await prisma.documentCategory.delete({ where: { id } });
            res.json({ message: 'Pasta removida. Arquivos movidos para Geral.' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao deletar pasta' });
        }
    },
    // DELETE /documents/:id - Deletar documento
    async delete(req, res) {
        try {
            const { id } = req.params;
            const { currentUserRole } = req.body;
            if (!['Desenvolvedor', 'RH'].includes(currentUserRole)) {
                return res.status(403).json({ error: 'Apenas desenvolvedores e RH podem remover arquivos.' });
            }
            const document = await prisma.document.findUnique({ where: { id } });
            if (!document) {
                return res.status(404).json({ error: 'Documento não encontrado.' });
            }
            // Deletar o arquivo do sistema
            const filePath = path_1.default.join(process.cwd(), document.url);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
            await prisma.document.delete({ where: { id } });
            res.json({ message: 'Documento excluído com sucesso.' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao excluir documento' });
        }
    }
};
