import {
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JsonWebTokenError } from '@nestjs/jwt'
import type { CookieOptions, Response } from 'express'

import { Cookies } from 'src/common/decorators'
import AuthService from './auth.service'

@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Cookies({ key: 'rft', signed: true }) refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const rftKey = 'rft'
    const cookieOpts: CookieOptions = {
      path: '/api/v1/auth/refresh',
      httpOnly: true,
      sameSite: 'strict',
      secure: this.configService.get('NODE_ENV') === 'production',
      signed: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    }
    try {
      const { accessToken, refreshToken: newRefreshToken } = refreshToken
        ? await this.authService.refreshToken(refreshToken)
        : await this.authService.genGuestToken()

      res.cookie(rftKey, newRefreshToken, cookieOpts)

      return { accessToken }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        res.clearCookie(rftKey, cookieOpts)
        throw new UnauthorizedException()
      }
      console.log(error)
      throw new InternalServerErrorException()
    }
  }
}
