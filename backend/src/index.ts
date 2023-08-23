import { config } from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import router from "@routes/index";
import decodeToken from "@middleware/decode-token.middleware";

config();

const app: Application = express();
app.use(cors());

app.use("/api", decodeToken, router);

const PORT: Number = Number(process.env.PORT) || 8080;

app.listen(PORT, () => {
  console.log(`Express started on port ${PORT} :)`);
});
