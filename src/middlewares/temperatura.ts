let temperaturaA = 20;
let luz = false;

export function temperaturaAtual(req: any, res: any) {
  res.status(200).send({ temperatura: temperaturaA });
}

export function turnLight(req: any, res: any) {
  if (luz) {
    res.status(200).send("Desligada");
  } else {
    res.status(200).send("Ligada");
  }
  luz = !luz;
}

export function setTemperatura(req: any, res: any) {
  const { temperatura } = req.params;
  temperaturaA = temperatura;

  res.status(200).send("Temperatura atualizada com sucesso");
}
