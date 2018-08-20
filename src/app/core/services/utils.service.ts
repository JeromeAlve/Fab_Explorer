import { Injectable } from '@angular/core';
import { address } from 'bitcoinjs-lib';

@Injectable()
export class UtilsService {
  constructor(
  ) {
  }

  static checkHashType(hash: string) {
    try {
      address.fromBase58Check(hash);
      return 'address';
    } catch (TypeError) {
      if (hash.length !== 64) {
        return null;
      }
      return 'tx/block';
    }
  }
}
