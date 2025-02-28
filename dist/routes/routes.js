"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const login_1 = __importDefault(require("../middlewares/login"));
const laboratorios_1 = require("../middlewares/laboratorios");
const videoTutorial_1 = __importDefault(require("../middlewares/videoTutorial"));
const temperatura_1 = require("../middlewares/temperatura");
exports.userRoutes = express_1.default.Router();
exports.userRoutes.post("/login", login_1.default, (req, res) => {
    res.status(200).send({
        message: "Login bem-sucedido!",
        user: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
        },
        token: req.user.token,
    });
});
exports.userRoutes.post("/laboratorios/novo", laboratorios_1.verifyToken, laboratorios_1.upload.single("foto"), laboratorios_1.postLaboratorio);
exports.userRoutes.get("/laboratorios", laboratorios_1.verifyToken, laboratorios_1.isDiaUtil, laboratorios_1.getAllLaboratorios);
exports.userRoutes.get("/laboratorios/pdf", laboratorios_1.verifyToken, laboratorios_1.gerarPdfLaboratorios);
exports.userRoutes.get("/video/:filename", videoTutorial_1.default);
exports.userRoutes.get("/laboratorioPagina", (req, res) => {
    res.sendFile(__dirname + "/site/index.html");
});
exports.userRoutes.post("/bloquear/:lab", laboratorios_1.blockLab);
exports.userRoutes.get("/temperatura", temperatura_1.temperaturaAtual);
exports.userRoutes.post("/setTemparatura/:temperatura", temperatura_1.setTemperatura);
exports.userRoutes.post("/ligarLuz", temperatura_1.turnLight);
