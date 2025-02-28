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
const laboratorios_1 = require("../middlewares/laboratorios");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock("jsonwebtoken");
describe("verifyToken Middleware", () => {
    it("deve retornar erro se o token não for fornecido", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { headers: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next = jest.fn();
        yield (0, laboratorios_1.verifyToken)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({
            error: "Token de autenticação é necessário.",
        });
    }));
    it("deve retornar erro se o token for inválido", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            headers: { authorization: "Bearer invalidtoken" },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next = jest.fn();
        jsonwebtoken_1.default.verify.mockImplementation(() => {
            throw new Error("Invalid token");
        });
        yield (0, laboratorios_1.verifyToken)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({
            error: "Token inválido ou expirado.",
        });
    }));
    it("deve chamar next se o token for válido", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { headers: { authorization: "Bearer validtoken" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next = jest.fn();
        jsonwebtoken_1.default.verify.mockReturnValue({
            id: "userId",
            email: "user@example.com",
        });
        yield (0, laboratorios_1.verifyToken)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual({ id: "userId", email: "user@example.com" });
    }));
});
