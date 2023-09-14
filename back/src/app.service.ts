import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  result = 0

  getResult () {
    return this.result
  }

  increment () {
    this.result++
  }

  decrement () {
    if (this.result > 0) this.result--
  }

  randomColor (role: string) {
    return role === 'admin' ? '#' + Math.floor(Math.random() * 16777215).toString(16) : '#000000'
  }
}
