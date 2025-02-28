"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.upload = void 0;
exports.verifyToken = verifyToken;
exports.postLaboratorio = postLaboratorio;
exports.isDiaUtil = isDiaUtil;
exports.getAllLaboratorios = getAllLaboratorios;
exports.gerarPdfLaboratorios = gerarPdfLaboratorios;
exports.blockLab = blockLab;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const db_1 = __importStar(require("../db/db"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const mongodb_1 = require("mongodb");
const __1 = require("..");
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage: storage });
function verifyToken(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .send({ error: "Token de autenticação é necessário." });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, db_1.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Erro ao verificar o token:", error.message);
        return res.status(401).send({ error: "Token inválido ou expirado." });
    }
}
function postLaboratorio(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nome, descricao, capacidade } = req.body;
        const foto = req.file;
        if (!nome || !descricao || !capacidade || !foto) {
            return res
                .status(400)
                .send({ error: "Nome, descrição, capacidade e foto são obrigatórios." });
        }
        try {
            const fotoBinaria = foto.buffer;
            const client = yield (0, db_1.default)();
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
            const result = yield laboratorioCollection.insertOne(newLaboratorio);
            const laboratorioCriado = yield laboratorioCollection.findOne({
                _id: result.insertedId,
            });
            res.status(201).send({
                message: "Laboratório criado com sucesso",
                laboratorio: laboratorioCriado,
            });
        }
        catch (error) {
            console.error("Erro ao criar laboratório:", error.message);
            res.status(500).send({ error: "Erro interno do servidor." });
        }
    });
}
function isDiaUtil(req, res, next) {
    const diasUteis = [1, 2, 3, 4, 5];
    const hoje = new Date().getDay();
    if (!diasUteis.includes(hoje)) {
        return res
            .status(403)
            .send({ error: "Esta rota só pode ser acessada em dias úteis." });
    }
    next();
}
function getAllLaboratorios(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield (0, db_1.default)();
            const laboratorioCollection = client
                .db("BancoBancoso")
                .collection("laboratorio");
            const laboratorios = yield laboratorioCollection.find().toArray();
            res.status(200).send({
                message: "Laboratórios encontrados com sucesso",
                laboratorios,
            });
        }
        catch (error) {
            console.error("Erro ao buscar laboratórios:", error.message);
            res.status(500).send({ error: "Erro interno do servidor." });
        }
    });
}
function gerarPdfLaboratorios(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield (0, db_1.default)();
            const laboratorioCollection = client
                .db("BancoBancoso")
                .collection("laboratorio");
            const laboratorios = yield laboratorioCollection.find().toArray();
            const doc = new pdfkit_1.default();
            doc.pipe(res);
            doc.fontSize(16).text("Lista de Laboratórios", { align: "center" });
            doc.moveDown();
            for (const laboratorio of laboratorios) {
                doc.fontSize(12).text(`Nome: ${laboratorio.nome}`);
                doc.text(`Descrição: ${laboratorio.descricao}`);
                doc.text(`Capacidade: ${laboratorio.capacidade}`);
                doc.moveDown();
                let imageBuffer = null;
                if (laboratorio.foto && laboratorio.foto instanceof mongodb_1.Binary) {
                    imageBuffer = laboratorio.foto.buffer;
                }
                else if (Buffer.isBuffer(laboratorio.foto)) {
                    imageBuffer = laboratorio.foto;
                }
                console.log("Imagem Buffer:", imageBuffer);
                console.log("Imagem Buffer (tamanho):", imageBuffer ? imageBuffer.length : 0);
                if (imageBuffer && imageBuffer.length > 0) {
                    try {
                        doc.image(imageBuffer, { width: 100, height: 100 });
                        doc.moveDown(10);
                    }
                    catch (err) {
                        console.error("Erro ao adicionar imagem no PDF:", err);
                        doc.text("Erro ao carregar imagem.");
                    }
                }
                else {
                    doc.text("Imagem inválida ou ausente.");
                }
                doc.moveDown();
            }
            doc.end();
        }
        catch (error) {
            console.error("Erro ao gerar o PDF:", error.message);
            res.status(500).send({ error: "Erro ao gerar o PDF." });
        }
    });
}
let bloqueado = false;
function blockLab(req, res) {
    if (bloqueado) {
        res.status(200).send(`Laboratório desbloqueado com sucesso!`);
        __1.io.emit("bloqueado", { message: `Laboratório desbloqueado com sucesso!` });
    }
    else {
        res.status(200).send(`Laboratório bloqueado com sucesso!`);
        __1.io.emit("bloqueado", { message: `Laboratório bloqueado com sucesso!` });
    }
    bloqueado = !bloqueado;
}
