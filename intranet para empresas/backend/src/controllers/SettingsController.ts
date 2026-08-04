import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const SettingsController = {
  async getSetting(req: any, res: any) {
    try {
      const { key } = req.params;
      const setting = await prisma.systemSetting.findUnique({
        where: { key }
      });
      if (!setting) return res.status(404).json({ error: 'Configuração não encontrada' });
      res.json(setting);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar configuração' });
    }
  },

  async updateSetting(req: any, res: any) {
    try {
      const { key } = req.params;
      const { value, currentUserRole } = req.body;

      if (currentUserRole !== 'Desenvolvedor' && currentUserRole !== 'RH') {
        return res.status(403).json({ error: 'Acesso negado. Apenas Desenvolvedores e RH podem alterar configurações globais.' });
      }

      if (value === undefined) {
        return res.status(400).json({ error: 'Valor da configuração é obrigatório.' });
      }

      const setting = await prisma.systemSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });

      res.json(setting);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar configuração' });
    }
  }
};
