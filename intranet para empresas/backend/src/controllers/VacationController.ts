import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const VacationController = {
  // GET /vacations
  async index(req: any, res: any) {
    try {
      // Recebe os dados de quem está logado (enviados via query/headers na prática, aqui simplificado)
      const { role, isManager, currentUserId } = req.query;

      if (!role) {
        return res.status(400).json({ error: 'Faltam dados de autenticação' });
      }

      let vacations = [];

      const currentUserObj = await prisma.user.findUnique({ where: { id: currentUserId } });
      if (!currentUserObj) return res.status(404).json({ error: 'Usuário não encontrado' });

      // Apenas RH vê tudo globalmente
      if (role === 'RH') {
        vacations = await prisma.vacation.findMany({
          include: { user: true },
          orderBy: { startDate: 'desc' }
        });
      } 
      // Gestor vê os dele mesmo e de quem ele é manager
      else if (currentUserObj.isManager) {
        
        const myName = currentUserObj.name;
        
        vacations = await prisma.vacation.findMany({
          where: {
            OR: [
              { userId: currentUserId }, // Dele mesmo
              { user: { manager: myName } } // Subordinados
            ]
          },
          include: { user: true },
          orderBy: { startDate: 'desc' }
        });
      } 
      // Colaborador normal (incluindo dev se não for RH/Manager) vê apenas os próprios agendamentos
      else {
        vacations = await prisma.vacation.findMany({
          where: { userId: currentUserId },
          include: { user: true },
          orderBy: { startDate: 'desc' }
        });
      }

      res.json(vacations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao listar férias' });
    }
  },

  // POST /vacations
  async create(req: any, res: any) {
    try {
      const { userId, startDate, endDate, status, approverName } = req.body;

      if (!userId || !startDate || !endDate) {
        return res.status(400).json({ error: 'Preencha usuário, data de início e data final' });
      }

      const vacation = await prisma.vacation.create({
        data: {
          userId,
          startDate,
          endDate,
          status: status || 'Pendente',
          approvedBy: approverName || ''
        },
        include: { user: true }
      });

      res.status(201).json(vacation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao agendar férias' });
    }
  },

  // DELETE /vacations/:id
  async delete(req: any, res: any) {
    try {
      const { id } = req.params;
      await prisma.vacation.delete({ where: { id } });
      res.json({ message: 'Férias canceladas' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao cancelar férias' });
    }
  }
};
