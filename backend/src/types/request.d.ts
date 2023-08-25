import { Request } from "express";
import User from "../interfaces/user";

declare module "express" {
  interface Request {
    decodedToken?: DecodedIdToken;
    user?: User;
  }
}
