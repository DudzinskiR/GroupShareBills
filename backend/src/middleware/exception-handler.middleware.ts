import Exception from "@exceptions/exception";
import express, { Request, Response, NextFunction } from "express";

const exceptionHandler = (
  e: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (e instanceof Exception) {
    res.status(e.code).json({ status: "error", message: e.message });
  } else {
    console.log(e);
    res.status(500).json({ status: "error", message: "Unknown error" });
  }
  next();
};

export default exceptionHandler;
