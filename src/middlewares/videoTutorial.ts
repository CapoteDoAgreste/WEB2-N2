import path from "path";
import fs from "fs";

export default function videoTutorial(req: any, res: any, next: any) {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "./../videos", filename);

  const videoStream = fs.createReadStream(filePath);
  res.setHeader("Content-Type", "video/mp4");

  videoStream.pipe(res);

  videoStream.on("error", (err: any) => {
    console.error("Error streaming video:", err);
    res.status(404).send("Video not found");
  });
}
