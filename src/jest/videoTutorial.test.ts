import videoTutorial from "../middlewares/videoTutorial";
import { Request, Response } from "express";
import fs from "fs";
import { EventEmitter } from "events";

jest.mock("fs");

describe("videoTutorial Middleware", () => {
  it("deve retornar erro 404 se o vídeo não for encontrado", async () => {
    const req = { params: { filename: "video.mp4" } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    // Mock fs.createReadStream to simulate an asynchronous error event
    (fs.createReadStream as jest.Mock).mockImplementationOnce(() => {
      const stream = new EventEmitter();
      process.nextTick(() => {
        stream.emit("error", new Error("File not found"));
      });
      return stream as unknown as fs.ReadStream;
    });

    // Call the middleware
    await videoTutorial(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("Video not found");
  });

  it("deve transmitir vídeo com sucesso", async () => {
    const req = { params: { filename: "tutorial.mp4" } } as unknown as Request;
    const res = {
      setHeader: jest.fn(),
      pipe: jest.fn(),
    } as unknown as Response;

    // Mock fs.createReadStream to return a stream (in this case, a simple string "stream")
    (fs.createReadStream as jest.Mock).mockReturnValueOnce("stream");

    await videoTutorial(req, res, jest.fn());

    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "video/mp4");
    expect(res.pipe).toHaveBeenCalledWith("stream");
  });
});
