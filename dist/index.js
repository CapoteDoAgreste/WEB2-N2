"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes/routes");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
// Criação do aplicativo Express
const app = (0, express_1.default)();
// Criação do servidor HTTP
const server = http_1.default.createServer(app);
// Inicializando o Socket.IO com o servidor HTTP
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Ou defina o domínio específico do seu frontend se necessário
        methods: ["GET", "POST"],
    },
});
// Definindo a porta do servidor
const PORT = process.env.PORT || 3000;
// Middleware para parsing de JSON
app.use(express_1.default.json());
// Rotas de usuários
app.use("/api", routes_1.userRoutes);
// Iniciando o servidor HTTP (incluindo WebSocket com Socket.IO)
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log("USER:", process.env.USER);
    console.log("PASSWORD:", process.env.PASSWORD);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
});
