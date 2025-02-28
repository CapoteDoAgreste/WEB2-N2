// At the very top of isDiaUtil.test.ts
jest.mock("../middlewares/laboratorios", () => {
  const originalModule = jest.requireActual("../middlewares/laboratorios");
  return {
    ...originalModule,
    // Provide a dummy implementation for upload.single to avoid the error
    upload: {
      single: jest.fn(
        (fieldName: string) => (req: any, res: any, next: any) => next()
      ),
    },
  };
});

import { isDiaUtil } from "../middlewares/laboratorios";
import { Request, Response } from "express";

describe("isDiaUtil Middleware", () => {
  it("deve retornar erro se não for dia útil", () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    jest.spyOn(Date.prototype, "getDay").mockReturnValue(6); // Sábado

    isDiaUtil(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({
      error: "Esta rota só pode ser acessada em dias úteis.",
    });
  });

  it("deve chamar next se for dia útil", () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    jest.spyOn(Date.prototype, "getDay").mockReturnValue(1); // Segunda-feira

    isDiaUtil(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
