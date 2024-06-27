import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, UserTokens } from '@prisma/client';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { LoginResponse } from './dto/login.response';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from './public.decorator';
import { OAuth2Client } from 'google-auth-library';


const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
 );
 
/** User authentication endpoints */
@ApiTags('authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Authenticates the User */
  @ApiOperation({ summary: 'Logs in user' })
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() { email, password }: LoginCredentialsDto,
    @Req() request: Request,
  ): Promise<LoginResponse> {
    const browserInfo =
      `${request.ip} ${request.headers['user-agent']} ${request.headers['accept-language']}`.replace(
        / undefined/g,
        '',
      );

    return this.authService.login(email, password, browserInfo);
  }


  
  /** Authenticates the google User */
  @ApiOperation({ summary: 'Logs in user' })
  @Public()
  @Post('/loginwithGoogle')
  @HttpCode(HttpStatus.OK)
  async loginGoogle(@Body('token') token,
  @Req() request: Request,
): Promise<any> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
     // log the ticket payload in the console to see what we have
    console.log(ticket.getPayload());
    const browserInfo =
    `${request.ip} ${request.headers['user-agent']} ${request.headers['accept-language']}`.replace(
      / undefined/g,
      '',
    );
    var payload=ticket.getPayload();
    return this.authService.loginWithGoogle(payload.email,payload.given_name,payload.family_name,payload.picture, payload.sub,Role.USER, browserInfo);
    // {
    //   iss: 'https://accounts.google.com',
    //   azp: '573257970241-48rmtunqrtq4n2mkc24igh1otmd6s1qm.apps.googleusercontent.com',
    //   aud: '573257970241-48rmtunqrtq4n2mkc24igh1otmd6s1qm.apps.googleusercontent.com',
    //   sub: '104555479736899507088',
    //   email: 'popsi.aaliyah.codes@gmail.com',
    //   email_verified: true,
    //   nbf: 1718786643,
    //   name: 'Adegoke Adeleke',
    //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocKq2hZPNTV_uRHTdoiKoBvNqTw7cGZkEq13PWG6YjuhZBVt_w=s96-c',
    //   given_name: 'Adegoke',
    //   family_name: 'Adeleke',
    //   iat: 1718786943,
    //   exp: 1718790543,
    //   jti: 'ca6cecc3b8bc0d3b16f6ad0877e600e1d61adb9e'
    // }
    
     }


      /** Authenticates the google User */
  @ApiOperation({ summary: 'Logs in user' })
  @Public()
  @Post('/loginwithGoogleSeller')
  @HttpCode(HttpStatus.OK)
  async loginGoogleSeller(@Body('token') token,
  @Req() request: Request,
): Promise<any> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
     // log the ticket payload in the console to see what we have
    console.log(ticket.getPayload());
    const browserInfo =
    `${request.ip} ${request.headers['user-agent']} ${request.headers['accept-language']}`.replace(
      / undefined/g,
      '',
    );
    var payload=ticket.getPayload();
    return this.authService.loginWithGoogle(payload.email,payload.given_name,payload.family_name,payload.picture, payload.sub,Role.SELLER, browserInfo);
    // {
    //   iss: 'https://accounts.google.com',
    //   azp: '573257970241-48rmtunqrtq4n2mkc24igh1otmd6s1qm.apps.googleusercontent.com',
    //   aud: '573257970241-48rmtunqrtq4n2mkc24igh1otmd6s1qm.apps.googleusercontent.com',
    //   sub: '104555479736899507088',
    //   email: 'popsi.aaliyah.codes@gmail.com',
    //   email_verified: true,
    //   nbf: 1718786643,
    //   name: 'Adegoke Adeleke',
    //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocKq2hZPNTV_uRHTdoiKoBvNqTw7cGZkEq13PWG6YjuhZBVt_w=s96-c',
    //   given_name: 'Adegoke',
    //   family_name: 'Adeleke',
    //   iat: 1718786943,
    //   exp: 1718790543,
    //   jti: 'ca6cecc3b8bc0d3b16f6ad0877e600e1d61adb9e'
    // }
     }

          /** Authenticates the google User */
  @ApiOperation({ summary: 'Logs in user' })
  @Public()
  @Post('/loginwithGoogleAgent')
  @HttpCode(HttpStatus.OK)
  async loginGoogleAgent(@Body('token') token,
  @Req() request: Request,
): Promise<any> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
     // log the ticket payload in the console to see what we have
    console.log(ticket.getPayload());
    const browserInfo =
    `${request.ip} ${request.headers['user-agent']} ${request.headers['accept-language']}`.replace(
      / undefined/g,
      '',
    );
    var payload=ticket.getPayload();
    return this.authService.loginWithGoogle(payload.email,payload.given_name,payload.family_name,payload.picture, payload.sub,Role.AGENT, browserInfo);
    // {
    //   iss: 'https://accounts.google.com',
    //   azp: '573257970241-48rmtunqrtq4n2mkc24igh1otmd6s1qm.apps.googleusercontent.com',
    //   aud: '573257970241-48rmtunqrtq4n2mkc24igh1otmd6s1qm.apps.googleusercontent.com',
    //   sub: '104555479736899507088',
    //   email: 'popsi.aaliyah.codes@gmail.com',
    //   email_verified: true,
    //   nbf: 1718786643,
    //   name: 'Adegoke Adeleke',
    //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocKq2hZPNTV_uRHTdoiKoBvNqTw7cGZkEq13PWG6YjuhZBVt_w=s96-c',
    //   given_name: 'Adegoke',
    //   family_name: 'Adeleke',
    //   iat: 1718786943,
    //   exp: 1718790543,
    //   jti: 'ca6cecc3b8bc0d3b16f6ad0877e600e1d61adb9e'
    // }
     }

  /** Refreshes the user token for silent authentication */
  @ApiOperation({ summary: 'Refreshes user token' })
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() { refreshToken }: RefreshTokenDto,
    @Req() request: Request,
  ): Promise<LoginResponse> {
    const browserInfo =
      `${request.ip} ${request.headers['user-agent']} ${request.headers['accept-language']}`.replace(
        / undefined/g,
        '',
      );

    return this.authService.refreshToken(refreshToken, browserInfo);
  }

  /** Logs out the User from the current session */
  @ApiOperation({ summary: 'Logs out user' })
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() { refreshToken }: LogoutDto): Promise<void> {
    return this.authService.logout(refreshToken);
  }

  /** Logs out the User from all sessions */
  @ApiOperation({ summary: 'Logs out user of all sessions' })
  @ApiBearerAuth()
  @Post('logoutAll')
  @HttpCode(HttpStatus.OK)
  async logoutAll(@Req() request: Request): Promise<void> {
    const { userId } = request.user as { userId: string };

    return this.authService.logoutAll(userId);
  }

  /** Returns all user's active tokens */
  @ApiOperation({ summary: 'Returns all user active tokens' })
  @ApiBearerAuth()
  @Get('tokens')
  async findAllTokens(@Req() request: Request): Promise<UserTokens[]> {
    const { userId } = request.user as { userId: string };

    return this.authService.findAllTokens(userId);
  }
}
