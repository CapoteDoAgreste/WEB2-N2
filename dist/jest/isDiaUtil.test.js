"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// At the very top of isDiaUtil.test.ts
jest.mock("../middlewares/laboratorios", () => {
    const originalModule = jest.requireActual("../middlewares/laboratorios");
    return Object.assign(Object.assign({}, originalModule), { 
        // Provide a dummy implementation for upload.single to avoid the error
        upload: {
            single: jest.fn((fieldName) => (req, res, next) => next()),
        } });
});
const laboratorios_1 = require("../middlewares/laboratorios");
describe("isDiaUtil Middleware", () => {
    it("deve retornar erro se não for dia útil", () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next = jest.fn();
        jest.spyOn(Date.prototype, "getDay").mockReturnValue(6); // Sábado
        (0, laboratorios_1.isDiaUtil)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({
            error: "Esta rota só pode ser acessada em dias úteis.",
        });
    });
    it("deve chamar next se for dia útil", () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next = jest.fn();
        jest.spyOn(Date.prototype, "getDay").mockReturnValue(1); // Segunda-feira
        (0, laboratorios_1.isDiaUtil)(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
