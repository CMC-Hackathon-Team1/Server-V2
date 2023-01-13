import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => {
    return {
      // secret: 'teamOnAndOff',
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    };
  },
};
