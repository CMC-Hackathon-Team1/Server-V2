import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async registerAccount(@Body() userDTO: UserDTO): Promise<any> {
    return await this.authService.registerUser(userDTO);
  }

  @Post('/login')
  async login(@Body() userDTO: UserDTO): Promise<any> {
    return await this.authService.validateUser(userDTO);
  }
}
