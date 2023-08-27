require("dotenv").config();

import express, { Application } from "express";
import cors from "cors";
import router from "@routes/index";
import decodeToken from "@middleware/decode-token.middleware";
import getUser from "@middleware/get-user.middleware";
import exceptionHandler from "@middleware/exception-handler.middleware";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use("/api", decodeToken, getUser, router);
app.use(exceptionHandler);

const PORT: Number = Number(process.env.PORT) || 8080;

app.listen(PORT, () => {
  console.log(`Express started on port ${PORT} :)`);
});
