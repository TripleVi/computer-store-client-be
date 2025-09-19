import {
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { JsonWebTokenError } from '@nestjs/jwt'
import type { Request, Response } from 'express'
import AuthService from './auth.service'

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getToken(@Res({ passthrough: true }) res: Response) {
    try {
      const { accessToken, refreshToken } = await this.authService.guest()
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/api/v1/auth/refresh',
        secure: true,
        signed: true,
        priority: 'medium',
      })
      return { accessToken, refreshToken }
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }

  @Post('refresh')
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const oldRefreshToken = req.signedCookies.refreshToken as string | undefined
    try {
      const { accessToken, refreshToken } = oldRefreshToken
        ? await this.authService.refreshToken(oldRefreshToken)
        : await this.authService.guest()

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/api/v1/auth/refresh',
        secure: true,
        signed: true,
        priority: 'medium',
      })

      return { accessToken }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' })
        throw new UnauthorizedException()
      }
      console.log(error)
      throw new InternalServerErrorException()
    }
  }
}
