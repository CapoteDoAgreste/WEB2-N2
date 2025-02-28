import login from "../middlewares/login";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "../db/db";

jest.mock("../db/db");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Login Middleware", () => {
  it("deve retornar erro se email ou senha não forem fornecidos", async () => {
    const req = { body: { email: "", password: "" } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      error: "Email e senha são obrigatórios.",
    });
  });

  it("deve retornar erro se credenciais forem inválidas", async () => {
    const req = {
      body: { email: "email@example.com", password: "senha" },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    (connectDB as jest.Mock).mockResolvedValueOnce({
      db: () => ({
        collection: () => ({
          findOne: jest.fn().mockResolvedValue(null),
        }),
      }),
    });

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: "Credenciais inválidas." });
  });

  it("deve chamar next se credenciais forem válidas", async () => {
    const req = {
      body: { email: "email@example.com", password: "senha" },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    (connectDB as jest.Mock).mockResolvedValueOnce({
      db: () => ({
        collection: () => ({
          findOne: jest.fn().mockResolvedValue({
            _id: "userId",
            email: "email@example.com",
            password:
              "$2b$10$W8y5xwOGYFL9DWmT2uw0jOdwHqFU9D/RW4hyXzTldkX9E6T3hEfhC", // hashed password
          }),
        }),
      }),
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("jwtToken");

    await login(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({
      id: "userId",
      email: "email@example.com",
      token: "jwtToken",
    });
  });
});
