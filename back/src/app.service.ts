import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  result: number = 0;
  getResult() {
    return this.result;
  }
  increment() {
    this.result++;
  }
  decrement() {
    if (this.result > 0) this.result--;
  }
}
