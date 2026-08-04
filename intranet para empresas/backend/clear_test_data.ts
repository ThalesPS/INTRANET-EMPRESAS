import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando limpeza de dados de teste...");

  // 1. Minhas Notas e Gestão de Notas (NotaFiscal)
  console.log("Deletando Notas Fiscais...");
  const notas = await prisma.notaFiscal.deleteMany({});
  console.log(`Deletadas ${notas.count} Notas Fiscais.`);

  // 2. Comunidade (Post e Comment)
  console.log("Deletando Comunidade (Comentários e Posts)...");
  const comments = await prisma.comment.deleteMany({});
  console.log(`Deletados ${comments.count} Comentários.`);
  
  const posts = await prisma.post.deleteMany({});
  console.log(`Deletados ${posts.count} Posts.`);

  // 3. Avisos (Announcement)
  console.log("Deletando Avisos (Announcements)...");
  const announcements = await prisma.announcement.deleteMany({});
  console.log(`Deletados ${announcements.count} Avisos.`);

  // 4. Solicitações (Ticket e TicketMessage)
  console.log("Deletando Solicitações (Mensagens e Tickets)...");
  const messages = await prisma.ticketMessage.deleteMany({});
  console.log(`Deletadas ${messages.count} Mensagens de Tickets.`);
  
  const tickets = await prisma.ticket.deleteMany({});
  console.log(`Deletados ${tickets.count} Tickets.`);

  console.log("Limpeza de dados de teste concluída com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro durante a limpeza de dados:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
