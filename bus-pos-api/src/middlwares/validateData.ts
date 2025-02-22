import { NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { Request, Response } from "express";

export const valiateData = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "error",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
        return;
      }

      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  };
};
