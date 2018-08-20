export interface Tx {
  txid: string;
  hash: string;
  version: number;
  size: number;
  vsize: number;
  locktime: number;
  vin: TxVin[];
  vout: TxVout[];
  blockhash: string;
  hex: string;
}

export interface UTXO {
  txid: string;
  voutindex: number;
  value: number;
  createdate: string;
}

export interface TxSummary {
  value: number;
  txid: string;
  block: number;
  sequence: number;
}

export interface TxVin {
  coinbase: string | null;
  sequence: number;
  vout: number | null;
  txid: string | null;
  scriptSig: ScriptSignature | null;
}

export interface ScriptSignature {
  asm: string;
  hex: string;
}

export interface TxVout {
  value: number;
  n: number;
  scriptPubKey: ScriptPubKey;
}

export interface ScriptPubKey {
  asm: string;
  hex: string;
  reqSigs: number;
  type: string;
  addresses: string[];
}
