import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ticketRoutes from './routes/ticketRoutes';
import userRoutes from './routes/userRoutes';
import announcementRoutes from './routes/announcementRoutes';
import documentRoutes from './routes/documentRoutes';
import quickLinkRoutes from './routes/quickLinkRoutes';
import feedRoutes from './routes/feedRoutes';
import calendarRoutes from './routes/calendarRoutes';
import settingsRoutes from './routes/settingsRoutes';
import roleRoutes from './routes/roleRoutes';
import notaFiscalRoutes from './routes/notaFiscalRoutes';
import uploadRoutes from './routes/uploadRoutes';
import { VacationController } from './controllers/VacationController';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/tickets', ticketRoutes);
app.use('/users', userRoutes);
app.use('/announcements', announcementRoutes);
app.use('/documents', documentRoutes);
app.use('/quicklinks', quickLinkRoutes);
app.use('/feed', feedRoutes);
app.use('/calendar', calendarRoutes);
app.use('/settings', settingsRoutes);
app.use('/roles', roleRoutes);
app.use('/notas-fiscais', notaFiscalRoutes);
app.use('/upload', uploadRoutes);

// Rotas de Férias
app.get('/vacations', VacationController.index);
app.post('/vacations', VacationController.create);
app.delete('/vacations/:id', VacationController.delete);

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Hello World from Neon Flow API!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
