"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = videoTutorial;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function videoTutorial(req, res, next) {
    const { filename } = req.params;
    const filePath = path_1.default.join(__dirname, "./../videos", filename);
    const videoStream = fs_1.default.createReadStream(filePath);
    res.setHeader("Content-Type", "video/mp4");
    videoStream.pipe(res);
    videoStream.on("error", (err) => {
        console.error("Error streaming video:", err);
        res.status(404).send("Video not found");
    });
}
