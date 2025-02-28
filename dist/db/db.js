"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_KEY = void 0;
exports.default = connectDB;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv")); // Para carregar variáveis de ambiente
dotenv_1.default.config();
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@bancobancoso.f1abl.mongodb.net/?retryWrites=true&w=majority&appName=BancoBancoso`;
console.log(uri);
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
exports.SECRET_KEY = process.env.JWT_SECRET || "";
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Tenta conectar ao banco de dados
            yield client.connect();
            // Verifica a conexão com o banco (usando o comando ping)
            const db = client.db();
            yield db.command({ ping: 1 }); // Comando ping para garantir que a conexão foi estabelecida
            console.log("Conectado ao MongoDB com sucesso!");
        }
        catch (error) {
            console.error("Erro ao conectar ao MongoDB:", error);
        }
        return client;
    });
}
