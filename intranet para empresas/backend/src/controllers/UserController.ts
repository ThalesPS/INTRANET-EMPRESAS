import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UserController = {
  // PATCH /users/:id/accept-policy - Aceitar a política de privacidade
  async acceptPolicy(req: any, res: any) {
    try {
      const { id } = req.params;
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { acceptedPolicy: true }
      });
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao aceitar a política de privacidade' });
    }
  },

  // POST /users/login - Login de usuário
  async login(req: any, res: any) {
    try {
      const { login, password } = req.body;
      if (!login || !password) {
        return res.status(400).json({ error: 'Usuário/E-mail e senha são obrigatórios' });
      }

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { equals: login, mode: 'insensitive' } },
            { username: { equals: login, mode: 'insensitive' } }
          ]
        }
      });

      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao processar login' });
    }
  },

  // GET /users - Listar todos os colaboradores
  async index(req: any, res: any) {
    try {
      const users = await prisma.user.findMany({
        orderBy: { name: 'asc' }
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar colaboradores' });
    }
  },

  // GET /users/:id - Detalhes do perfil (incluindo histórico)
  async show(req: any, res: any) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          history: {
            orderBy: { date: 'desc' }
          }
        }
      });
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
  },

  // PATCH /users/:id - Atualizar dados do perfil
  async update(req: any, res: any) {
    try {
      const { id } = req.params;
      const { bio, phone, skills, avatarUrl, coverUrl, active, password, birthDate, historyEvent, currentUserId, currentUserRole, currentUserDepartment, manager, isManager, name, username, email, role, department } = req.body;

      // Se tentar adicionar um evento no histórico, precisa ser administrador ou do departamento de RH
      if (historyEvent) {
        const isUserHR = currentUserRole === 'Desenvolvedor' || currentUserRole === 'RH' || currentUserDepartment === 'Recursos Humanos' || currentUserDepartment === 'RH';
        if (!isUserHR) {
          return res.status(403).json({ error: 'Apenas usuários do RH ou administradores podem alterar a trajetória de carreira.' });
        }
      }

      // Se não for administrador, só pode editar o próprio perfil
      if (currentUserRole !== 'Desenvolvedor') {
        if (currentUserId !== id) {
          return res.status(403).json({ error: 'Você não tem permissão para editar o perfil de outros colaboradores.' });
        }
      }

      const updateData: any = { bio, phone, skills, avatarUrl, coverUrl };
      if (birthDate !== undefined) updateData.birthDate = birthDate;
      if (manager !== undefined) updateData.manager = manager;
      
      if (currentUserRole === 'Desenvolvedor' || currentUserRole === 'RH') {
        if (active !== undefined) updateData.active = active;
        if (isManager !== undefined) updateData.isManager = isManager;
        if (name !== undefined) updateData.name = name;
        if (username !== undefined) updateData.username = username;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;
        if (department !== undefined) updateData.department = department;
        if (password !== undefined && currentUserRole === 'Desenvolvedor') updateData.password = password;
      }

      // Se for o próprio usuário mudando sua senha no primeiro acesso ou no perfil
      if (currentUserId === id && password !== undefined) {
        updateData.password = password;
      }
      
      // Permitir atualização do firstAccess pelo próprio usuário ou admin
      if (req.body.firstAccess !== undefined) {
        updateData.firstAccess = req.body.firstAccess;
      }

      // Se houver um evento de histórico, adicionamos ao relacionamento
      if (historyEvent) {
        updateData.history = {
          create: {
            type: historyEvent.type,
            description: historyEvent.description,
            date: historyEvent.date
          }
        };
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        include: { history: true }
      });

      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  },

  // POST /users - Criar novo colaborador
  async create(req: any, res: any) {
    try {
      const { 
        name, 
        username, 
        email, 
        password, 
        role, 
        department, 
        avatarUrl, 
        coverUrl, 
        bio, 
        phone, 
        manager, 
        skills,
        birthDate,
        isManager,
        currentUserRole 
      } = req.body;

      if (currentUserRole !== 'Desenvolvedor') {
        return res.status(403).json({ error: 'Apenas desenvolvedores podem cadastrar novos colaboradores.' });
      }

      if (!name || !username || !email || !password || !role || !department) {
        return res.status(400).json({ error: 'Campos obrigatórios: nome, login, e-mail, senha, cargo e departamento.' });
      }

      // Verificar se e-mail já existe
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
      }

      // Verificar se username já existe
      const existingUsername = await prisma.user.findUnique({ where: { username } });
      if (existingUsername) {
        return res.status(400).json({ error: 'Este login já está cadastrado.' });
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          username,
          email,
          password,
          role,
          department,
          avatarUrl: avatarUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9TroTAeayDb44-oNimlJiNBIzEH0af2Izid_23rU_hA&s=10",
          coverUrl: coverUrl || '',
          bio: bio || '',
          phone: phone || '',
          manager: manager || '',
          skills: skills || '',
          birthDate: birthDate || null,
          isManager: isManager || false
        }
      });

      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao cadastrar colaborador.' });
    }
  },

  // DELETE /users/:id - Excluir colaborador
  async delete(req: any, res: any) {
    try {
      const { id } = req.params;
      const { currentUserRole } = req.body;

      if (currentUserRole !== 'Desenvolvedor') {
        return res.status(403).json({ error: 'Apenas desenvolvedores podem excluir colaboradores.' });
      }

      // Deletar dependências (histórico)
      await prisma.careerEvent.deleteMany({ where: { userId: id } });
      
      // Deletar o usuário
      await prisma.user.delete({ where: { id } });

      res.json({ message: 'Colaborador excluído com sucesso.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao excluir colaborador.' });
    }
  }
};
