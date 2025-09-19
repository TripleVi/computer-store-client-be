import { Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request } from 'express'

export default class LoggerMiddleware implements NestMiddleware {
  use(req: Request, _: any, next: NextFunction) {
    const logger = new Logger('Request')
    logger.log(`[${req.method}] ${req.url}`)
    next()
  }
}
