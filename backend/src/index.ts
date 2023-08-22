import { config } from "dotenv";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { Server } from "http";
import router from "./routes";

config();

const app: Application = express();
app.use(cors());

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send(`API running`);
});

const PORT: Number = Number(process.env.PORT) || 8080;
const server: Server = app.listen(PORT, () => {
  console.log(`Express started on port ${PORT} :)`);
});
