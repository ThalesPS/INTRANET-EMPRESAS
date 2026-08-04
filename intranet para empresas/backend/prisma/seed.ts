import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  // Limpar dados existentes (opcional)
  await prisma.careerEvent.deleteMany({});
  await prisma.user.deleteMany({});

  const users = [
    {
      id: 'alex-moreira-id', // ID fixo para facilitar o desenvolvimento
      name: 'Alex Moreira',
      email: 'alex.moreira@bbr.com',
      username: 'alex',
      password: '123@mudar',
      role: 'usuário',
      department: 'Tecnologia',
      avatarUrl: 'https://i.pravatar.cc/150?u=alex',
      bio: 'Apaixonado por tecnologia e soluções inovadoras.',
      phone: '(11) 98765-4321',
      manager: 'Mariana Silva',
      skills: 'React, TypeScript, Node.js, SQL',
      firstAccess: false,
      history: {
        create: [
          { type: 'entrada', description: 'Entrada na empresa como Estagiário', date: '15/01/2022' },
          { type: 'promoção', description: 'Promovido a Analista de Sistemas Júnior', date: '01/02/2023' }
        ]
      }
    },
    {
      name: 'Mariana Silva',
      email: 'mariana.silva@bbr.com',
      username: 'mariana',
      password: '123@mudar',
      role: 'usuário',
      department: 'Tecnologia',
      avatarUrl: 'https://i.pravatar.cc/150?u=mariana',
      bio: 'Gestão de times de alta performance e infraestrutura.',
      phone: '(11) 91234-5678',
      skills: 'Gestão, AWS, Segurança',
      firstAccess: false,
      history: {
        create: [
          { type: 'entrada', description: 'Contratada como Gerente de TI', date: '10/05/2020' }
        ]
      }
    },
    {
      name: 'Fernanda RH',
      email: 'fernanda.rh@bbr.com',
      username: 'fernanda',
      password: '123@mudar',
      role: 'administrador',
      department: 'Recursos Humanos',
      avatarUrl: 'https://i.pravatar.cc/150?u=fernanda',
      bio: 'Focada em cultura organizacional e desenvolvimento humano.',
      phone: '(11) 95555-5555',
      skills: 'Recrutamento, Cultura, Treinamento',
      firstAccess: false,
      history: {
        create: [
          { type: 'entrada', description: 'Entrada no time de Talent Acquisition', date: '20/08/2021' }
        ]
      }
    },
    {
      id: 'thales-admin-id',
      name: 'Thales',
      email: 'thales@bbr.com',
      username: 'Thales',
      password: '123@mudar',
      role: 'administrador',
      department: 'Administração',
      avatarUrl: 'https://i.pravatar.cc/150?u=thales',
      bio: 'Administrador geral do sistema.',
      phone: '(11) 99999-9999',
      skills: 'Administração, Liderança, Negociação',
      firstAccess: false,
      history: {
        create: [
          { type: 'entrada', description: 'Entrada na empresa como Administrador Geral', date: '01/01/2025' }
        ]
      }
    }
  ];

  for (const u of users) {
    await prisma.user.create({
      data: u
    });
  }

  console.log('Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
