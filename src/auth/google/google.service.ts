import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Injectable()
export class GoogleService {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  googleLogin(req) {
    if (!req.user) {
      return 'No user';
    }

    return {
      user: req.user,
    };
  }
}
