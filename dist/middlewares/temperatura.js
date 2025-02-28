"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.temperaturaAtual = temperaturaAtual;
exports.turnLight = turnLight;
exports.setTemperatura = setTemperatura;
let temperaturaA = 20;
let luz = false;
function temperaturaAtual(req, res) {
    res.status(200).send({ temperatura: temperaturaA });
}
function turnLight(req, res) {
    if (luz) {
        res.status(200).send("Desligada");
    }
    else {
        res.status(200).send("Ligada");
    }
    luz = !luz;
}
function setTemperatura(req, res) {
    const { temperatura } = req.params;
    temperaturaA = temperatura;
    res.status(200).send("Temperatura atualizada com sucesso");
}
