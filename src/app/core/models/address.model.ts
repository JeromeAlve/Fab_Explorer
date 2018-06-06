import {UTXO} from './transaction.model';

export interface AddressInfo {
  address: string;
  coinAmount: number;
  transactions: UTXO[];
}
