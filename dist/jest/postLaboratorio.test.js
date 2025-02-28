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
const db_1 = __importDefault(require("../db/db"));
const laboratorios_1 = require("../middlewares/laboratorios");
const stream_1 = require("stream"); // Importando a classe Readable para criar o mock do stream
// Mock do módulo upload (multer)
jest.mock("../middlewares/laboratorios", () => {
    const originalModule = jest.requireActual("../middlewares/laboratorios");
    return Object.assign(Object.assign({}, originalModule), { upload: {
            single: jest
                .fn()
                .mockImplementation((fieldName) => (req, res, next) => {
                // Simula que o upload foi bem-sucedido, com o objeto de file correto
                req.file = {
                    fieldname: "foto",
                    originalname: "foto.jpg",
                    encoding: "7bit",
                    mimetype: "image/jpeg",
                    size: 1024,
                    buffer: Buffer.from("image"), // Simula o buffer do arquivo
                    destination: "/uploads", // Opcional
                    filename: "foto.jpg", // Opcional
                    path: "/uploads/foto.jpg", // Opcional
                    stream: stream_1.Readable.from(Buffer.from("image")), // Simulando um stream de leitura
                };
                next(); // Passa para o próximo middleware
            }),
        } });
});
jest.mock("../db/db");
describe("postLaboratorio Function", () => {
    it("deve retornar erro se parâmetros estiverem ausentes", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            body: { nome: "", descricao: "", capacidade: "" },
            file: null,
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        yield (0, laboratorios_1.postLaboratorio)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            error: "Nome, descrição, capacidade e foto são obrigatórios.",
        });
    }));
    it("deve criar laboratório com sucesso", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            body: {
                nome: "Lab 1",
                descricao: "Laboratório de exemplo",
                capacidade: "10",
            },
            file: { buffer: Buffer.from("image") },
            user: { id: "user123" }, // Simulate authenticated user
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        db_1.default.mockResolvedValueOnce({
            db: () => ({
                collection: () => ({
                    insertOne: jest.fn().mockResolvedValue({ insertedId: "newId" }),
                    findOne: jest.fn().mockResolvedValue({
                        _id: "newId",
                        nome: "Lab 1",
                        descricao: "Laboratório de exemplo",
                        capacidade: 10,
                        foto: Buffer.from("image"),
                    }),
                }),
            }),
        });
        yield (0, laboratorios_1.postLaboratorio)(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({
            message: "Laboratório criado com sucesso",
            laboratorio: {
                _id: "newId",
                nome: "Lab 1",
                descricao: "Laboratório de exemplo",
                capacidade: 10,
                foto: Buffer.from("image"),
            },
        });
    }));
});
