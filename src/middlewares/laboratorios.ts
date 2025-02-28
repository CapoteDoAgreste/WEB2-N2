import jwt from "jsonwebtoken";
import multer from "multer";
import connectDB, { SECRET_KEY } from "../db/db";
import PDFDocument from "pdfkit";
import { Binary } from "mongodb";
import { io } from "..";

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export function verifyToken(req: any, res: any, next: any) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ error: "Token de autenticação é necessário." });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error("Erro ao verificar o token:", error.message);
    return res.status(401).send({ error: "Token inválido ou expirado." });
  }
}

export async function postLaboratorio(req: any, res: any) {
  const { nome, descricao, capacidade } = req.body;
  const foto = req.file;

  if (!nome || !descricao || !capacidade || !foto) {
    return res
      .status(400)
      .send({ error: "Nome, descrição, capacidade e foto são obrigatórios." });
  }

  try {
    const fotoBinaria = foto.buffer;

    const client = await connectDB();
    const laboratorioCollection = client
      .db("BancoBancoso")
      .collection("laboratorio");

    const newLaboratorio = {
      nome,
      descricao,
      capacidade: Number(capacidade),
      foto: fotoBinaria,
      createdAt: new Date(),
      createdBy: req.user.id,
    };

    const result = await laboratorioCollection.insertOne(newLaboratorio);

    const laboratorioCriado = await laboratorioCollection.findOne({
      _id: result.insertedId,
    });

    res.status(201).send({
      message: "Laboratório criado com sucesso",
      laboratorio: laboratorioCriado,
    });
  } catch (error: any) {
    console.error("Erro ao criar laboratório:", error.message);
    res.status(500).send({ error: "Erro interno do servidor." });
  }
}

export function isDiaUtil(req: any, res: any, next: any) {
  const diasUteis = [1, 2, 3, 4, 5];
  const hoje = new Date().getDay();

  if (!diasUteis.includes(hoje)) {
    return res
      .status(403)
      .send({ error: "Esta rota só pode ser acessada em dias úteis." });
  }

  next();
}

export async function getAllLaboratorios(req: any, res: any) {
  try {
    const client = await connectDB();
    const laboratorioCollection = client
      .db("BancoBancoso")
      .collection("laboratorio");

    const laboratorios = await laboratorioCollection.find().toArray();

    res.status(200).send({
      message: "Laboratórios encontrados com sucesso",
      laboratorios,
    });
  } catch (error: any) {
    console.error("Erro ao buscar laboratórios:", error.message);
    res.status(500).send({ error: "Erro interno do servidor." });
  }
}

export async function gerarPdfLaboratorios(req: any, res: any) {
  try {
    const client = await connectDB();
    const laboratorioCollection = client
      .db("BancoBancoso")
      .collection("laboratorio");

    const laboratorios = await laboratorioCollection.find().toArray();

    const doc = new PDFDocument();

    doc.pipe(res);

    doc.fontSize(16).text("Lista de Laboratórios", { align: "center" });
    doc.moveDown();

    for (const laboratorio of laboratorios) {
      doc.fontSize(12).text(`Nome: ${laboratorio.nome}`);
      doc.text(`Descrição: ${laboratorio.descricao}`);
      doc.text(`Capacidade: ${laboratorio.capacidade}`);
      doc.moveDown();

      let imageBuffer = null;

      if (laboratorio.foto && laboratorio.foto instanceof Binary) {
        imageBuffer = laboratorio.foto.buffer;
      } else if (Buffer.isBuffer(laboratorio.foto)) {
        imageBuffer = laboratorio.foto;
      }

      console.log("Imagem Buffer:", imageBuffer);
      console.log(
        "Imagem Buffer (tamanho):",
        imageBuffer ? imageBuffer.length : 0
      );

      if (imageBuffer && imageBuffer.length > 0) {
        try {
          doc.image(imageBuffer, { width: 100, height: 100 });
          doc.moveDown(10);
        } catch (err) {
          console.error("Erro ao adicionar imagem no PDF:", err);
          doc.text("Erro ao carregar imagem.");
        }
      } else {
        doc.text("Imagem inválida ou ausente.");
      }

      doc.moveDown();
    }

    doc.end();
  } catch (error: any) {
    console.error("Erro ao gerar o PDF:", error.message);
    res.status(500).send({ error: "Erro ao gerar o PDF." });
  }
}

let bloqueado = false;

export function blockLab(req: any, res: any) {
  if (bloqueado) {
    res.status(200).send(`Laboratório desbloqueado com sucesso!`);
    io.emit("bloqueado", { message: `Laboratório desbloqueado com sucesso!` });
  } else {
    res.status(200).send(`Laboratório bloqueado com sucesso!`);
    io.emit("bloqueado", { message: `Laboratório bloqueado com sucesso!` });
  }
  bloqueado = !bloqueado;
}
