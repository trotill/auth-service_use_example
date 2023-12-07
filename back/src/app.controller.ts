import { Controller, Get, Post, HttpCode, Req } from '@nestjs/common'
import { AppService } from './app.service'
import { ForRoles } from './guard/roles.decorator'

@Controller()
export class AppController {
  constructor (private readonly appService: AppService) {
  }

    @Get('result')
  result (): number {
    return this.appService.getResult()
  }

    @Post('increment')
    @HttpCode(204)
    increment () {
      this.appService.increment()
    }

    @ForRoles(['admin'])
    @Post('decrement')
    @HttpCode(204)
    decrement () {
      this.appService.decrement()
    }

    @Get('randomColor')
    randomColor (@Req() request: Request): string {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const role = ('whoAmi' in request && ('role' in request.whoAmi)) ? request.whoAmi.role as string : 'guest'

      return this.appService.randomColor(role)
    }
}
