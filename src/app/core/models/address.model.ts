import { TxSummary, UTXO } from './transaction.model';

export interface AddressInfo {
  address: string;
  coinAmount: number;
  transactions: TxSummary[]; // UTXO[];
}

export interface AddressBalance {
  address: string;
  balance: number;
}

export interface AddressTransactions {
  address: string;
  utxos: TxSummary[];
}
