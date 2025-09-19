import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export interface CookiesDecoratorOptions {
  key: string
  signed: boolean
}

const Cookies = createParamDecorator(
  (options: CookiesDecoratorOptions, ctx: ExecutionContext) => {
    const { key, signed } = options
    const req: Request = ctx.switchToHttp().getRequest()
    const cookies = signed ? req.signedCookies : req.cookies
    return key ? (cookies[key] as unknown) : cookies
  }
)

export default Cookies
