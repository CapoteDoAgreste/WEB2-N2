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
const login_1 = __importDefault(require("../middlewares/login"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db/db"));
jest.mock("../db/db");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
describe("Login Middleware", () => {
    it("deve retornar erro se email ou senha não forem fornecidos", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { body: { email: "", password: "" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next = jest.fn();
        yield (0, login_1.default)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            error: "Email e senha são obrigatórios.",
        });
    }));
    it("deve retornar erro se credenciais forem inválidas", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            body: { email: "email@example.com", password: "senha" },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next = jest.fn();
        db_1.default.mockResolvedValueOnce({
            db: () => ({
                collection: () => ({
                    findOne: jest.fn().mockResolvedValue(null),
                }),
            }),
        });
        yield (0, login_1.default)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ error: "Credenciais inválidas." });
    }));
    it("deve chamar next se credenciais forem válidas", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            body: { email: "email@example.com", password: "senha" },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next = jest.fn();
        db_1.default.mockResolvedValueOnce({
            db: () => ({
                collection: () => ({
                    findOne: jest.fn().mockResolvedValue({
                        _id: "userId",
                        email: "email@example.com",
                        password: "$2b$10$W8y5xwOGYFL9DWmT2uw0jOdwHqFU9D/RW4hyXzTldkX9E6T3hEfhC", // hashed password
                    }),
                }),
            }),
        });
        bcrypt_1.default.compare.mockResolvedValue(true);
        jsonwebtoken_1.default.sign.mockReturnValue("jwtToken");
        yield (0, login_1.default)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual({
            id: "userId",
            email: "email@example.com",
            token: "jwtToken",
        });
    }));
});
