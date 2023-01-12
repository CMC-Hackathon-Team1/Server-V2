import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from './dto/user.dto';
import { JWTAuthGuard } from './security/auth.guard.jwt';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async registerAccount(@Body() userDTO: UserDTO): Promise<any> {
    return await this.authService.registerUser(userDTO);
  }

  @Post('/login')
  async login(@Body() userDTO: UserDTO): Promise<any> {
    console.log(typeof process.env.JWT_SECRET);
    return await this.authService.validateUser(userDTO);
  }

  @UseGuards(JWTAuthGuard)
  @Get('/authenticate')
  isAuthenticated(@Req() req: Request): any {
    const user: any = req.user;
    return user;
  }
}
