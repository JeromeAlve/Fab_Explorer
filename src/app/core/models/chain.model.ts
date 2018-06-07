export interface Chain {
  chain: string;
  blocks: number;
  headers: number;
  bestblockhash: string;
  difficulty: number;
  mediantime: number;
  verificationprogress: number;
  chainwork: string;
  pruned: boolean;
  softforks: SForks[];
  bip9_softforks: Bip9Forks[];
  tmp: any; // to hold any intermediate value
}

export interface Bip9Forks {
  csv: BForks;
  segwit: BForks;
}


export interface BForks {
  status: string;
  startTime: number;
  timeout: number;
  since: number;
}

export interface SForks {
  id: string;
  version: number;
  reject: Status;
}

export interface Status {
  status: boolean;
}
