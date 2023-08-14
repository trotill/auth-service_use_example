import { ConfigModule } from "@nestjs/config";
ConfigModule.forRoot({
  envFilePath: `.env`,
});

import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import * as path from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { APP_GUARD } from "@nestjs/core";
import { RoleGlobalGuard } from "./guard/roleGlobalGuard";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve("..", "front", "dist"),
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RoleGlobalGuard,
    },
    AppService,
  ],
})
export class AppModule {}
