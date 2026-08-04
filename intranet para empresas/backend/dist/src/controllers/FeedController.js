"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.FeedController = {
    // GET /feed - Listar todas as postagens com comentários
    async index(req, res) {
        try {
            const posts = await prisma.post.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    comments: {
                        orderBy: { createdAt: 'asc' }
                    }
                }
            });
            res.json(posts);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao listar o mural.' });
        }
    },
    // POST /feed - Criar uma nova postagem
    async create(req, res) {
        try {
            const { content, author } = req.body;
            const file = req.file;
            if (!content || !author) {
                return res.status(400).json({ error: 'Conteúdo e autor são obrigatórios.' });
            }
            let imageUrl = null;
            if (file) {
                imageUrl = `/uploads/feed/${file.filename}`;
            }
            const newPost = await prisma.post.create({
                data: {
                    content,
                    author,
                    imageUrl,
                    likedBy: []
                },
                include: {
                    comments: true
                }
            });
            res.status(201).json(newPost);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao criar a postagem.' });
        }
    },
    // POST /feed/:id/like - Alternar curtida (Like/Unlike)
    async toggleLike(req, res) {
        try {
            const { id } = req.params;
            const { author } = req.body; // Identificador de quem está curtindo
            const post = await prisma.post.findUnique({ where: { id } });
            if (!post) {
                return res.status(404).json({ error: 'Postagem não encontrada.' });
            }
            let newLikedBy = [...post.likedBy];
            if (newLikedBy.includes(author)) {
                // Remover curtida
                newLikedBy = newLikedBy.filter(name => name !== author);
            }
            else {
                // Adicionar curtida
                newLikedBy.push(author);
            }
            const updatedPost = await prisma.post.update({
                where: { id },
                data: { likedBy: newLikedBy },
                include: { comments: true }
            });
            res.json(updatedPost);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao processar a curtida.' });
        }
    },
    // POST /feed/:id/comment - Adicionar comentário
    async addComment(req, res) {
        try {
            const { id } = req.params;
            const { content, author } = req.body;
            if (!content || !author) {
                return res.status(400).json({ error: 'Conteúdo e autor são obrigatórios.' });
            }
            const comment = await prisma.comment.create({
                data: {
                    postId: id,
                    content,
                    author
                }
            });
            res.status(201).json(comment);
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar comentário.' });
        }
    },
    // DELETE /feed/:id - Deletar postagem (apenas RH/Dev)
    async delete(req, res) {
        try {
            const { id } = req.params;
            const { currentUserRole } = req.body;
            if (!['Desenvolvedor', 'RH'].includes(currentUserRole)) {
                return res.status(403).json({ error: 'Sem permissão para excluir postagens.' });
            }
            const post = await prisma.post.findUnique({ where: { id } });
            if (post && post.imageUrl) {
                try {
                    const fs = require('fs');
                    const path = require('path');
                    const filePath = path.join(process.cwd(), post.imageUrl);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
                catch (e) {
                    console.error('Erro ao excluir arquivo de imagem:', e);
                }
            }
            await prisma.post.delete({ where: { id } });
            res.json({ message: 'Postagem excluída com sucesso.' });
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao excluir a postagem.' });
        }
    }
};
