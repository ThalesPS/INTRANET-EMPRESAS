import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Migrating administradores...');
  const res1 = await prisma.user.updateMany({
    where: { role: 'administrador' },
    data: { role: 'Desenvolvedor' }
  });
  console.log(`Updated ${res1.count} administradores to Desenvolvedor.`);

  console.log('Migrating usuários...');
  const res2 = await prisma.user.updateMany({
    where: { role: 'usuário' },
    data: { role: 'Colaborador' }
  });
  console.log(`Updated ${res2.count} usuários to Colaborador.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
