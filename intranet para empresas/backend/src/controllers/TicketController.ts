import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateTicketCode = async () => {
  const count = await prisma.ticket.count();
  return `BBR-${1000 + count + 1}`;
};

export const TicketController = {
  // GET /tickets - Listar todos
  async index(req: any, res: any) {
    try {
      const tickets = await prisma.ticket.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar chamados' });
    }
  },

  // GET /tickets/:id - Detalhes do chamado + Mensagens
  async show(req: any, res: any) {
    try {
      const { id } = req.params;
      const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });
      if (!ticket) return res.status(404).json({ error: 'Chamado não encontrado' });
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar chamado' });
    }
  },

  // POST /tickets - Criar novo
  async create(req: any, res: any) {
    try {
      const { subject, category, department, description, author } = req.body;
      const code = await generateTicketCode();
      
      const newTicket = await prisma.ticket.create({
        data: {
          code,
          subject,
          category,
          department: department || 'RH',
          description,
          priority: 'media',
          author,
          status: 'aberto',
          messages: {
            create: [
              {
                author: "Sistema",
                content: `Chamado aberto por ${author}. Categoria: ${category}.`,
                isSystem: true
              }
            ]
          }
        }
      });
      res.status(201).json(newTicket);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar chamado' });
    }
  },

  // PATCH /tickets/:id - Atualizar status/responsável
  async update(req: any, res: any) {
    try {
      const { id } = req.params;
      const { status, assignee } = req.body;

      // Buscar o chamado atual para comparar
      const currentTicket = await prisma.ticket.findUnique({ where: { id } });
      if (!currentTicket) return res.status(404).json({ error: 'Chamado não encontrado' });

      // Preparar mensagens de sistema baseadas na alteração
      const messagesToCreate = [];
      if (assignee && assignee !== currentTicket.assignee) {
        messagesToCreate.push({
          author: "Sistema",
          content: `${assignee} assumiu este chamado.`,
          isSystem: true
        });
      }
      if (status && status === 'concluido' && currentTicket.status !== 'concluido') {
        if (req.body.conclusion) {
          messagesToCreate.push({
            author: req.body.author || "Sistema",
            content: `[CONCLUSÃO] ${req.body.conclusion}`,
            isSystem: false
          });
        }
        messagesToCreate.push({
          author: "Sistema",
          content: `Chamado marcado como Concluído.`,
          isSystem: true
        });
      }

      if (status && status === 'aguardando' && currentTicket.status === 'concluido') {
        messagesToCreate.push({
          author: req.body.author || "Sistema",
          content: `[REABERTO] ${req.body.reopenReason || "O usuário informou que o problema persiste e reabriu o chamado."}`,
          isSystem: false
        });
      }

      const updatedTicket = await prisma.ticket.update({
        where: { id },
        data: { 
          status, 
          assignee,
          messages: {
            create: messagesToCreate
          }
        }
      });

      res.json(updatedTicket);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar chamado' });
    }
  },

  // POST /tickets/:id/messages - Adicionar uma mensagem manual (chat)
  async addMessage(req: any, res: any) {
    try {
      const { id } = req.params;
      const { author, content } = req.body;

      const message = await prisma.ticketMessage.create({
        data: {
          ticketId: id,
          author,
          content,
          isSystem: false
        }
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
  },

  // GET /tickets/categories - Listar categorias
  async getCategories(req: any, res: any) {
    try {
      const categories = await prisma.ticketCategory.findMany({
        orderBy: [{ department: 'asc' }, { name: 'asc' }]
      });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
  },

  // POST /tickets/categories - Criar categoria
  async createCategory(req: any, res: any) {
    try {
      const { name, department } = req.body;
      const cat = await prisma.ticketCategory.create({ data: { name, department } });
      res.status(201).json(cat);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar categoria' });
    }
  },

  // DELETE /tickets/categories/:id - Deletar categoria
  async deleteCategory(req: any, res: any) {
    try {
      const { id } = req.params;
      await prisma.ticketCategory.delete({ where: { id } });
      res.json({ message: 'Categoria excluída' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir' });
    }
  }
};
