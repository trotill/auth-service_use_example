import { Controller, Get, Post, HttpCode } from "@nestjs/common";
import { AppService } from "./app.service";
import { ForRoles } from "./guard/roles.decorator";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("result")
  result(): number {
    return this.appService.getResult();
  }
  @Post("increment")
  @HttpCode(204)
  increment() {
    this.appService.increment();
  }
  @ForRoles(["admin"])
  @Post("decrement")
  @HttpCode(204)
  decrement() {
    this.appService.decrement();
  }
}
