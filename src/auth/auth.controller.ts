import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { TokenResponse, MessageResponse } from './interfaces/auth.interfaces';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<TokenResponse> {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle Mongoose validation error
        throw new BadRequestException(error.message);
      }
      if (error.code === 11000) {
        // MongoDB duplicate key error
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<TokenResponse> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(): Promise<void> {
    // Guard redirects to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response): Promise<void> {
    try {
      const { access_token } = await this.authService.googleLogin(req);

      // Redirect to frontend with token
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?token=${access_token}`,
      );
    } catch (error) {
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?error=Authentication failed`,
      );
    }
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<MessageResponse> {
    try {
      return await this.authService.forgotPassword(forgotPasswordDto.email);
    } catch (error) {
      // Always return success to prevent email enumeration
      return {
        message: 'If an account exists, a password reset email has been sent',
      };
    }
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResponse> {
    try {
      return await this.authService.resetPassword(
        resetPasswordDto.token,
        resetPasswordDto.newPassword,
      );
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req): Promise<any> {
    return req.user;
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req): Promise<MessageResponse> {
    // In a real application, you might want to invalidate the token here
    // This could involve adding it to a blacklist or implementing token revocation
    return { message: 'Successfully logged out' };
  }

  @Get('verify-token')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  verifyToken(): MessageResponse {
    return { message: 'Token is valid' };
  }
}
