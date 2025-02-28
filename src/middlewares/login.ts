import connectDB, { SECRET_KEY } from "../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function login(req: any, res: any, next: any) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: "Email e senha são obrigatórios." });
  }

  try {
    const client = await connectDB();
    const usersCollection = client.db("BancoBancoso").collection("users");

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).send({ error: "Credenciais inválidas." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      token,
    };

    next();
  } catch (error: any) {
    console.error("Erro no middleware de login:", error.message);
    res.status(500).send({ error: "Erro interno do servidor." });
  }
}
