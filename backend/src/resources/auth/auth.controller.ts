import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
  UnauthorizedException
} from '@nestjs/common'
import { ApiBearerAuth, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import ms from 'ms'
import { env } from '../../config/env.config'
import { MyCampus } from '../campi/entities/campus.entity'
import { MyUser } from '../users/entities/user.entity'
import { AuthUser, Campus } from './auth-user.decorator'
import { AuthService } from './auth.service'
import { LoginDto, LoginResponseDto } from './dto/login.dto'
import { MeDto } from './dto/me.dto'

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiException(() => UnauthorizedException)
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) response: Response): Promise<LoginResponseDto> {
    const { jwt, me } = await this.authService.loginWithGoogle(body.token)
    response.cookie('authorization', jwt, {
      httpOnly: true,
      secure: true,
      sameSite: env.VERCEL ? 'none' : 'strict',
      maxAge: ms('1 year')
    })
    return me
  }

  // TODO: Esta rota deve ser removida em produção
  @Post('/login/email/:email')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiException(() => UnauthorizedException)
  async loginEmail(
    @Param('email') email: string,
    @Res({ passthrough: true }) response: Response
  ): Promise<LoginResponseDto> {
    if (env.NODE_ENV !== 'development') {
      throw new NotFoundException()
    }

    const { jwt, me } = await this.authService.loginWithEmail(email)
    response.cookie('authorization', jwt, {
      httpOnly: true,
      secure: true,
      sameSite: env.VERCEL ? 'none' : 'strict',
      maxAge: ms('1 year')
    })
    return me
  }

  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async logout(@Res({ passthrough: true }) response: Response): Promise<void> {
    response.clearCookie('authorization')
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ type: MeDto })
  async me(@AuthUser() authUser: MyUser | null, @Campus() campus: MyCampus | null): Promise<MeDto | null> {
    const myData = await this.authService.getMyData(authUser, campus)
    return {
      user: authUser || null,
      campus: campus || null,
      ...myData
    }
  }
}
