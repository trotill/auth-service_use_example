import { Request, Response, NextFunction } from "express";
import { AUTH_SERVICE } from "src/const";
import { HttpException, HttpStatus } from "@nestjs/common";

async function whoAmi(req: Request) {
  const result = await fetch(`${AUTH_SERVICE}/auth`, {
    headers: {
      cookie: `access = ${req.cookies["access"]}`,
    },
    method: "GET",
  });
  if (result.status >= 400) {
    throw new HttpException(result.statusText, result.status);
  }
  req["whoAmi"] = await result.json();
}

export function authorizationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.url.startsWith("/api/")) {
    next();
  } else
    whoAmi(req)
      .then(() => {
        next();
      })
      .catch((e) => {
        const stat =
          "status" in e
            ? {
                message: e.message,
                code: e.status,
              }
            : {
                message: "Auth service unavailable",
                code: HttpStatus.SERVICE_UNAVAILABLE,
              };

        res.status(stat.code);
        res.send({
          message: stat.message,
          statusCode: stat.code,
        });
      });
}
