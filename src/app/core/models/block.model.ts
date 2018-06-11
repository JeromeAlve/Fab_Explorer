import { Tx } from './transaction.model';

export interface Block {
  hash: string;
  confirmations: number;
  strippedsize: number;
  size: number;
  weight: number;
  height: number;
  version: number;
  versionHex: string;
  merkleroot: string;
  tx: Tx[];
  time: number;
  date: Date;
  mediantime: number;
  nonceUint32: number;
  nonce: string;
  bits: string;
  difficulty: number;
  chainwork: string;
  previousblockhash: string;
  nextblockhash: string;
}
