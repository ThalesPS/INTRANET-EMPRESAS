import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const CalendarController = {
  // GET /calendar/upcoming - Listar eventos e aniversariantes próximos
  async getUpcoming(req: any, res: any) {
    try {
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // 1-12
      const currentMonthStr = currentMonth.toString().padStart(2, '0');
      
      // Buscar eventos a partir deste mês
      // Para simplificar, trazemos eventos onde a data >= primeiro dia do mês atual
      const firstDayOfMonth = `${today.getFullYear()}-${currentMonthStr}-01`;
      
      const events = await prisma.companyEvent.findMany({
        where: {
          date: {
            gte: firstDayOfMonth
          }
        },
        orderBy: { date: 'asc' }
      });

      res.json(events);
    } catch (error) {
      console.error('Erro no calendário:', error);
      res.status(500).json({ error: 'Erro ao buscar dados do calendário' });
    }
  },

  // POST /calendar/events - Criar evento
  async createEvent(req: any, res: any) {
    try {
      const { title, description, date, type, author, currentUserRole } = req.body;

      if (!['Desenvolvedor', 'RH'].includes(currentUserRole)) {
        return res.status(403).json({ error: 'Sem permissão para criar eventos.' });
      }

      if (!title || !date) {
        return res.status(400).json({ error: 'Título e data são obrigatórios.' });
      }

      const event = await prisma.companyEvent.create({
        data: {
          title,
          description,
          date,
          type: type || 'Evento',
          author
        }
      });

      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar evento.' });
    }
  },

  // DELETE /calendar/events/:id - Excluir evento
  async deleteEvent(req: any, res: any) {
    try {
      const { id } = req.params;
      const { currentUserRole } = req.body;

      if (!['Desenvolvedor', 'RH'].includes(currentUserRole)) {
        return res.status(403).json({ error: 'Sem permissão para excluir eventos.' });
      }

      await prisma.companyEvent.delete({ where: { id } });

      res.json({ message: 'Evento excluído com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir evento.' });
    }
  },

  // PUT /calendar/events/:id - Atualizar evento
  async updateEvent(req: any, res: any) {
    try {
      const { id } = req.params;
      const { title, description, date, type, currentUserRole } = req.body;

      if (!['Desenvolvedor', 'RH'].includes(currentUserRole)) {
        return res.status(403).json({ error: 'Sem permissão para editar eventos.' });
      }

      if (!title || !date) {
        return res.status(400).json({ error: 'Título e data são obrigatórios.' });
      }

      const updatedEvent = await prisma.companyEvent.update({
        where: { id },
        data: {
          title,
          description,
          date,
          type
        }
      });

      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao editar evento.' });
    }
  }
};
