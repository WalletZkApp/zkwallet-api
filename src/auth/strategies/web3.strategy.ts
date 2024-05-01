import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

import { AuthService } from '../auth.service';
import { AuthWeb3LoginDto } from '../dto/auth-web3-login.dto';

@Injectable()
export class Web3Strategy extends PassportStrategy(Strategy, 'web3') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(request: Request): Promise<any> {
    const body = JSON.parse(await request.text());
    const network = body?.network;
    const signedData = body?.signedData;
    const sharedKey = body?.sharedKey;
    const sharesOtpKey = body?.sharesOtpKey;
    const zkAppAddress = body?.zkAppAddress;
    const loginDto: AuthWeb3LoginDto = {
      network,
      signedData,
      sharedKey,
      sharesOtpKey,
      zkAppAddress,
    };
    const user = await this.authService.validateWeb3Login(loginDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
