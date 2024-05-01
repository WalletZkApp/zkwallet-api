import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// We test here with Add contract
import {
  AccountUpdate,
  Field,
  Mina,
  PrivateKey,
  fetchAccount,
  PublicKey,
} from 'o1js';
import { Add } from './Add';
import { KeysService } from 'src/keys/keys.service';
import { CreateKeyDto } from 'src/keys/dto/create-key.dto';
import { AllConfigType } from 'src/config/config.type';
import { Contract } from './domain/contract';

interface VerificationKeyData {
  data: string;
  hash: Field;
}

@Injectable()
export class MinaService {
  private readonly logger = new Logger(MinaService.name);
  private readonly serverPrivatekey: PrivateKey;

  constructor(private configService: ConfigService<AllConfigType>) {
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

  async deployContract(zkAppKey: PrivateKey): Promise<Contract> {
    const zkAppAddress: PublicKey = zkAppKey.toPublicKey();
    const transactionFee = 100_000_000;

    // Fee payer setup
    const senderKey: PrivateKey = PrivateKey.fromBase58(
      this.configService.getOrThrow<string>('mina.serverPrivateKey', {
        infer: true,
      }),
    );
    const sender: PublicKey = senderKey.toPublicKey();

    // zkApp compilation
    let zkApp = new Add(zkAppAddress);
    this.logger.log('Compiling the smart contract.');
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
      async () => {
        // Modify the callback function to return a Promise<void>
        AccountUpdate.fundNewAccount(sender);
        zkApp.deploy();
      },
    );

    transaction.sign([senderKey, zkAppKey]);
    this.logger.log('Sending the transaction.', transaction);

    await transaction.send();

    const contract: Contract = {
      publicKey: zkAppAddress.toBase58().toString(),
    };

    return contract;
  }
}
