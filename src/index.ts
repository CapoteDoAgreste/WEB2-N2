import express from "express";
import { userRoutes } from "./routes/routes";
import http from "http";
import { Server } from "socket.io";

// Criação do aplicativo Express
const app = express();

// Criação do servidor HTTP
const server = http.createServer(app);

// Inicializando o Socket.IO com o servidor HTTP
export const io = new Server(server, {
  cors: {
    origin: "*", // Ou defina o domínio específico do seu frontend se necessário
    methods: ["GET", "POST"],
  },
});

// Definindo a porta do servidor
const PORT = process.env.PORT || 3000;

// Middleware para parsing de JSON
app.use(express.json());

// Rotas de usuários
app.use("/api", userRoutes);

// Iniciando o servidor HTTP (incluindo WebSocket com Socket.IO)
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log("USER:", process.env.USER);
  console.log("PASSWORD:", process.env.PASSWORD);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
});
