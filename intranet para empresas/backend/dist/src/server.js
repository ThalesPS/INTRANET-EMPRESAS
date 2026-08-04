"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const announcementRoutes_1 = __importDefault(require("./routes/announcementRoutes"));
const documentRoutes_1 = __importDefault(require("./routes/documentRoutes"));
const quickLinkRoutes_1 = __importDefault(require("./routes/quickLinkRoutes"));
const feedRoutes_1 = __importDefault(require("./routes/feedRoutes"));
const calendarRoutes_1 = __importDefault(require("./routes/calendarRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const roleRoutes_1 = __importDefault(require("./routes/roleRoutes"));
const notaFiscalRoutes_1 = __importDefault(require("./routes/notaFiscalRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const VacationController_1 = require("./controllers/VacationController");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rotas da API
app.use('/tickets', ticketRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use('/announcements', announcementRoutes_1.default);
app.use('/documents', documentRoutes_1.default);
app.use('/quicklinks', quickLinkRoutes_1.default);
app.use('/feed', feedRoutes_1.default);
app.use('/calendar', calendarRoutes_1.default);
app.use('/settings', settingsRoutes_1.default);
app.use('/roles', roleRoutes_1.default);
app.use('/notas-fiscais', notaFiscalRoutes_1.default);
app.use('/upload', uploadRoutes_1.default);
// Rotas de Férias
app.get('/vacations', VacationController_1.VacationController.index);
app.post('/vacations', VacationController_1.VacationController.create);
app.delete('/vacations/:id', VacationController_1.VacationController.delete);
// Servir arquivos estáticos (uploads)
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'Hello World from Neon Flow API!' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
