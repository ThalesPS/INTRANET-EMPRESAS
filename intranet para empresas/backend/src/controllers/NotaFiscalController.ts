import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { MailService } from '../services/mailService';

const prisma = new PrismaClient();

export const NotaFiscalController = {
  async index(req: Request, res: Response) {
    try {
      const colaboradorId = req.query.colaboradorId as string;

      if (!colaboradorId) {
        return res.status(400).json({ error: 'colaboradorId é obrigatório' });
      }

      // Trava de segurança: Busca o usuário real no banco para ver seu nível de acesso
      const usuario = await prisma.user.findUnique({
        where: { id: colaboradorId }
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      // Se for RH ou Financeiro, lista todas as notas
      const isRHOrFinanceiro = 
        usuario.department === 'RH' || 
        usuario.department === 'Recursos Humanos' || 
        usuario.department === 'Financeiro' ||
        usuario.role === 'RH' ||
        usuario.role === 'Financeiro';

      const isAdmin = isRHOrFinanceiro || usuario.role === 'Desenvolvedor';
      const adminView = req.query.adminView === 'true';

      let notasFiscais;

      if (isAdmin && adminView) {
        notasFiscais = await prisma.notaFiscal.findMany({
          orderBy: { createdAt: 'desc' }
        });
      } else {
        // Usuário comum só vê suas próprias notas
        notasFiscais = await prisma.notaFiscal.findMany({
          where: { colaboradorId },
          orderBy: { createdAt: 'desc' }
        });
      }

      res.json(notasFiscais);
    } catch (error) {
      console.error('Erro ao listar notas fiscais:', error);
      res.status(500).json({ error: 'Erro interno ao buscar notas fiscais' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { colaboradorId, nomeColaborador, mesCompetencia, valor, tipo } = req.body;
      const file = req.file;

      if (!colaboradorId || !nomeColaborador || !mesCompetencia || !valor) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      if (!file) {
        return res.status(400).json({ error: 'O arquivo da nota fiscal é obrigatório' });
      }

      // Caminho relativo ao servidor
      const arquivoUrl = `/uploads/nfs/${file.filename}`;

      const novaNota = await prisma.notaFiscal.create({
        data: {
          colaboradorId,
          nomeColaborador,
          mesCompetencia,
          valor: parseFloat(valor),
          tipo: tipo || 'Nota Fiscal',
          arquivoUrl
        }
      });

      res.status(201).json(novaNota);
    } catch (error) {
      console.error('Erro ao criar nota fiscal:', error);
      res.status(500).json({ error: 'Erro ao enviar a nota fiscal' });
    }
  },

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, adminId, motivoRecusa } = req.body;

      if (!adminId) {
        return res.status(400).json({ error: 'O ID do administrador é obrigatório' });
      }

      // Validação rigorosa de permissão no banco
      const adminUser = await prisma.user.findUnique({
        where: { id: adminId }
      });

      if (!adminUser) {
        return res.status(404).json({ error: 'Usuário administrador não encontrado.' });
      }

      const isDevOrAdmin = adminUser.role === 'Desenvolvedor' || adminUser.role === 'Administrador' || adminUser.department === 'Administração';
      const isRH = adminUser.department === 'RH' || adminUser.department === 'Recursos Humanos' || adminUser.role === 'RH';
      const isFinanceiro = adminUser.department === 'Financeiro' || adminUser.role === 'Financeiro';

      if (status === 'Aprovada' || status === 'Recusada') {
        if (!isRH && !isDevOrAdmin) {
          return res.status(403).json({ error: 'Você não tem permissão para aprovar ou recusar notas. Apenas o RH pode realizar esta ação.' });
        }
      }

      if (status === 'Concluída') {
        if (!isFinanceiro && !isDevOrAdmin) {
          return res.status(403).json({ error: 'Você não tem permissão para realizar pagamentos. Apenas o Financeiro pode realizar esta ação.' });
        }
      }

      // Atualiza a nota fiscal
      const dataToUpdate: any = {
        status,
        motivoRecusa: status === 'Recusada' ? motivoRecusa : null 
      };

      if (status === 'Aprovada') {
        dataToUpdate.aprovador = adminUser.name;
      }

      const notaAtualizada = await prisma.notaFiscal.update({
        where: { id: id as string },
        data: dataToUpdate
      });

      res.json(notaAtualizada);
    } catch (error) {
      console.error('Erro ao atualizar status da nota fiscal:', error);
      res.status(500).json({ error: 'Erro interno ao atualizar a nota fiscal' });
    }
  },

  async reupload(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'O novo arquivo é obrigatório' });
      }

      // Caminho relativo ao servidor
      const arquivoUrl = `/uploads/nfs/${file.filename}`;

      const notaAtualizada = await prisma.notaFiscal.update({
        where: { id: id as string },
        data: {
          arquivoUrl,
          status: 'Pendente',
          motivoRecusa: null
        }
      });

      res.json(notaAtualizada);
    } catch (error) {
      console.error('Erro ao reenviar nota fiscal:', error);
      res.status(500).json({ error: 'Erro ao substituir o arquivo da nota fiscal' });
    }
  },

  async checkPendingAlert(req: Request, res: Response) {
    try {
      const colaboradorId = req.query.colaboradorId as string;
      if (!colaboradorId) {
        return res.status(400).json({ error: 'colaboradorId é obrigatório' });
      }

      const today = new Date();
      
      // Se já passou do dia 15, mantemos o alerta ou não? 
      // Comportamento escolhido: Só mostra se for <= 15
      if (today.getDate() > 15) {
        return res.json({ showAlert: false });
      }

      const monthString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      const monthsMap = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];
      // A label usual no front é "Mês de YYYY"
      const currentMonthLabel = `${monthsMap[today.getMonth()]} de ${today.getFullYear()}`;

      // Verifica se existe alguma nota para esse mesCompetencia (ou criada neste mês)
      const notas = await prisma.notaFiscal.findMany({
        where: { 
          colaboradorId,
          mesCompetencia: currentMonthLabel // Assuming the frontend sends something like "Julho de 2026"
        }
      });

      // Se o colaborador não enviou a nota com a label deste mês
      if (notas.length === 0) {
        return res.json({ showAlert: true });
      }

      return res.json({ showAlert: false });
    } catch (error) {
      console.error('Erro ao verificar alerta de nota fiscal:', error);
      res.status(500).json({ error: 'Erro interno' });
    }
  },

  async cobrarPendente(req: Request, res: Response) {
    try {
      const { email, name, mesCompetencia } = req.body;

      if (!email || !name || !mesCompetencia) {
        return res.status(400).json({ error: 'E-mail, nome e mês de competência são obrigatórios' });
      }

      await MailService.sendInvoiceReminder(email, name, mesCompetencia);
      
      res.json({ message: 'Lembrete enviado com sucesso' });
    } catch (error) {
      console.error('Erro ao enviar e-mail de cobrança:', error);
      res.status(500).json({ error: 'Erro ao enviar o e-mail de lembrete' });
    }
  }
};
