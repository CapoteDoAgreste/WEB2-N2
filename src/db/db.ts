import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv"; // Para carregar variáveis de ambiente
dotenv.config();

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@bancobancoso.f1abl.mongodb.net/?retryWrites=true&w=majority&appName=BancoBancoso`;
console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const SECRET_KEY = process.env.JWT_SECRET || "";

export default async function connectDB() {
  try {
    // Tenta conectar ao banco de dados
    await client.connect();

    // Verifica a conexão com o banco (usando o comando ping)
    const db = client.db();
    await db.command({ ping: 1 }); // Comando ping para garantir que a conexão foi estabelecida
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
  return client;
}
