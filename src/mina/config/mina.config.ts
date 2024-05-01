import { registerAs } from '@nestjs/config';
import { MinaConfig } from './mina-config.type';
import { IsOptional, IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  MINA_NETWORK_URL: string;

  @IsString()
  @IsOptional()
  MINA_SERVER_PUBLIC_KEY: string;

  @IsString()
  @IsOptional()
  MINA_SERVER_PRIVATE_KEY: string;
}

export default registerAs<MinaConfig>('mina', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    networkUrl: process.env.MINA_NETWORK_URL,
    serverPublicKey: process.env.MINA_SERVER_PUBLIC_KEY,
    serverPrivateKey: process.env.MINA_SERVER_PRIVATE_KEY,
  };
});
