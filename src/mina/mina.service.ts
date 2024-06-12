import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// We test here with Add contract
import { AccountUpdate, Mina, PrivateKey, PublicKey } from 'o1js';
import { combine } from 'shamir-secret-sharing';
import { base64 } from '@scure/base';
import { Add } from './Add';
import { AllConfigType } from 'src/config/config.type';
import { DeployDto } from './dto/deploy.dto';
import { UsersService } from 'src/users/users.service';
import { KeysService } from 'src/keys/keys.service';

@Injectable()
export class MinaService {
  private readonly logger = new Logger(MinaService.name);
  private readonly serverPrivatekey: PrivateKey;

  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly usersService: UsersService,
    private readonly keysService: KeysService,
  ) {
    const secretKeyFromConfig = this.configService.getOrThrow<string>(
      'mina.serverPrivateKey',
      { infer: true },
    );
    this.serverPrivatekey = PrivateKey.fromBase58(secretKeyFromConfig);

    const network = Mina.Network({
      mina: this.configService.getOrThrow<string>('mina.networkUrl', {
        infer: true,
      }),
    });
    Mina.setActiveInstance(network);

    this.logger.log('Mina network setted up');
  }

  async deployContract(
    deployDto: DeployDto,
    logedInUserId?: string,
  ): Promise<string> {
    const clonedPayload = {
      ...deployDto,
    };
    console.log('clonedPayload.sharedkey', clonedPayload.sharedkey);

    let recoveredKey: string = '';

    if (logedInUserId) {
      const logedInUser = await this.usersService.findOneOrFail({
        id: logedInUserId,
      });

      console.log('logedInUser', logedInUser);

      const serverSharedKey = await this.keysService.findOne({
        id: logedInUser.sharedkeys?.id,
      });

      if (serverSharedKey) {
        console.log('serverSharedKey', serverSharedKey.key);
        const combined = await this.combineSecret([
          clonedPayload.sharedkey,
          serverSharedKey.key,
        ]);
        console.log('combined', combined);
        recoveredKey = await this.keysService.decodeBase64(combined);
        console.log('recoveredKey', recoveredKey);
      }
    }
    let networkUrl = '';
    switch (deployDto.network) {
      case 'mainnet':
        networkUrl = 'https://graphql.minaexplorer.com';
        break;
      case 'testnet':
        networkUrl = 'https://proxy.testnet.minaexplorer.com';
        break;
      case 'devnet':
        networkUrl = 'https://proxy.devnet.minaexplorer.com';
        break;
    }

    const network = Mina.Network({
      mina: networkUrl + '/graphql',
    });

    Mina.setActiveInstance(network);
    const zkAppAddress: PublicKey =
      PublicKey.fromBase58(deployDto.zkAppAddress) ||
      PrivateKey.fromBase58(recoveredKey).toPublicKey();
    const transactionFee = 100_000_000;

    // Fee payer setup
    const senderKey: PrivateKey = PrivateKey.fromBase58(
      this.configService.getOrThrow<string>('mina.serverPrivateKey', {
        infer: true,
      }),
    );
    const sender: PublicKey = senderKey.toPublicKey();
    console.log('sender PublicKey', sender.toBase58().toString());

    // zkApp compilation
    const zkApp = new Add(zkAppAddress);
    this.logger.log('Compiling the smart contract.', zkApp);
    await Add.compile();

    // zkApp deployment
    this.logger.log(
      `Deploying zkApp for public key ${zkAppAddress.toBase58()}.`,
    );
    this.logger.log(
      `Deploying zkApp for public key ${zkAppAddress.toBase58()}.`,
    );
    const transaction = await Mina.transaction(
      { sender, fee: transactionFee },
      // eslint-disable-next-line @typescript-eslint/require-await
      async () => {
        AccountUpdate.fundNewAccount(sender);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        zkApp.deploy();
      },
    );

    transaction.sign([senderKey, PrivateKey.fromBase58(recoveredKey)]);
    this.logger.log('Sending the transaction.', transaction);

    const pendingTx = await transaction.send();
    console.log('pendingTx', pendingTx);

    return JSON.stringify(pendingTx.hash);
  }

  async combineSecret(shares: string[]): Promise<string> {
    console.log('combineSecret shares', shares);
    const sharesUint8Array: Uint8Array[] = shares.map((share) =>
      base64.decode(share),
    );
    const secret = await combine(sharesUint8Array);
    console.log('combineSecret secret', secret);
    const secretString: string = new TextDecoder().decode(secret);
    console.log('combineSecret secretString', secretString);
    return secretString;
  }
}
