import express from "express";
import login from "../middlewares/login";
import {
  verifyToken,
  upload,
  postLaboratorio,
  gerarPdfLaboratorios,
  getAllLaboratorios,
  isDiaUtil,
  blockLab,
} from "../middlewares/laboratorios";
import videoTutorial from "../middlewares/videoTutorial";
import {
  setTemperatura,
  temperaturaAtual,
  turnLight,
} from "../middlewares/temperatura";

export const userRoutes = express.Router();

userRoutes.post("/login", login, (req: any, res) => {
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

userRoutes.post(
  "/laboratorios/novo",
  verifyToken,
  upload.single("foto"),
  postLaboratorio
);

userRoutes.get("/laboratorios", verifyToken, isDiaUtil, getAllLaboratorios);

userRoutes.get("/laboratorios/pdf", verifyToken, gerarPdfLaboratorios);

userRoutes.get("/video/:filename", videoTutorial);

userRoutes.get("/laboratorioPagina", (req, res) => {
  res.sendFile(__dirname + "/site/index.html");
});

userRoutes.post("/bloquear/:lab", blockLab);

userRoutes.get("/temperatura", temperaturaAtual);

userRoutes.post("/setTemparatura/:temperatura", setTemperatura);

userRoutes.post("/ligarLuz", turnLight);
