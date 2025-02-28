import { Request, Response, NextFunction } from "express";
import connectDB from "../db/db";
import { postLaboratorio } from "../middlewares/laboratorios";
import { Readable } from "stream"; // Importando a classe Readable para criar o mock do stream

// Mock do módulo upload (multer)
jest.mock("../middlewares/laboratorios", () => {
  const originalModule = jest.requireActual("../middlewares/laboratorios");
  return {
    ...originalModule,
    upload: {
      single: jest
        .fn()
        .mockImplementation(
          (fieldName: string) =>
            (req: Request, res: Response, next: NextFunction) => {
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
                stream: Readable.from(Buffer.from("image")), // Simulando um stream de leitura
              };
              next(); // Passa para o próximo middleware
            }
        ),
    },
  };
});

jest.mock("../db/db");

describe("postLaboratorio Function", () => {
  it("deve retornar erro se parâmetros estiverem ausentes", async () => {
    const req = {
      body: { nome: "", descricao: "", capacidade: "" },
      file: null,
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    await postLaboratorio(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      error: "Nome, descrição, capacidade e foto são obrigatórios.",
    });
  });

  it("deve criar laboratório com sucesso", async () => {
    const req = {
      body: {
        nome: "Lab 1",
        descricao: "Laboratório de exemplo",
        capacidade: "10",
      },
      file: { buffer: Buffer.from("image") },
      user: { id: "user123" }, // Simulate authenticated user
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    (connectDB as jest.Mock).mockResolvedValueOnce({
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

    await postLaboratorio(req, res);

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
  });
});
