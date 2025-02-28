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
const videoTutorial_1 = __importDefault(require("../middlewares/videoTutorial"));
const fs_1 = __importDefault(require("fs"));
jest.mock("fs");
describe("videoTutorial Middleware", () => {
    it("deve retornar erro 404 se o vídeo não for encontrado", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { params: { filename: "video.mp4" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        // Mock do fs.createReadStream para simular erro de forma assíncrona
        fs_1.default.createReadStream.mockImplementationOnce(() => {
            const error = new Error("File not found");
            process.nextTick(() => {
                throw error;
            });
            return {}; // Retorna um objeto vazio para satisfazer o tipo
        });
        // Chama o middleware
        yield (0, videoTutorial_1.default)(req, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Video not found");
    }));
    it("deve transmitir vídeo com sucesso", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { params: { filename: "tutorial.mp4" } };
        const res = {
            setHeader: jest.fn(),
            pipe: jest.fn(),
        };
        // Mock do fs.createReadStream para retornar um stream
        fs_1.default.createReadStream.mockReturnValueOnce("stream");
        yield (0, videoTutorial_1.default)(req, res, jest.fn());
        expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "video/mp4");
        expect(res.pipe).toHaveBeenCalledWith("stream");
    }));
});
