import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export default class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  genRefreshToken(payload: object) {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow('REFRESH_TOKEN_EXPIRES_IN'),
    })
  }

  async genGuestToken() {
    const accessToken = await this.jwtService.signAsync({})
    const refreshToken = await this.genRefreshToken({})
    return { accessToken, refreshToken }
  }

  async refreshToken(token: string) {
    const payload: object = await this.jwtService.verifyAsync(token, {
      ignoreExpiration: false,
    })
    const accessToken = await this.jwtService.signAsync({})
    const refreshToken = await this.genRefreshToken({})
    return { accessToken, refreshToken }
  }
}
