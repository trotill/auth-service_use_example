import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createProxyMiddleware } from "http-proxy-middleware";
import * as cookieParser from "cookie-parser";
import { AUTH_SERVICE, LISTEN_PORT } from "src/const";
import { authorizationMiddleware } from "./middleware/auth.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const authService = createProxyMiddleware({
    target: AUTH_SERVICE,
    changeOrigin: true,
  });
  app.use("/auth", authService);
  app.use("/users", authService);
  app.use(cookieParser());
  app.use(authorizationMiddleware);
  await app.listen(+LISTEN_PORT);
  console.log("listen port", LISTEN_PORT);
}
bootstrap();
