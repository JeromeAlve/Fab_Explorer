import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Block, Chain, Tx, UTXO} from '../models';
import {Observable} from 'rxjs';

@Injectable()
export class ApiService {

  apiBase: string = environment.apiBase;

  constructor(private http: HttpClient) {
  }

  getAddressUTXOs(address: string): Observable<UTXO[]> {
    return this.http.get<UTXO[]>(`${this.apiBase}/unspenttransactionpolicy/${address}`);
  }

  getChainInfo(): Observable<Chain> {
    return this.http.get<Chain>(`${this.apiBase}/chaininfo.json`);
  }

  getBlockInfo(bId: string): Observable<Block> {
    return this.http.get<Block>(`${this.apiBase}/block/${bId}.json`);
  }

  getTxInfo(tId: string): Observable<Tx> {
    return this.http.get<Tx>(`${this.apiBase}/tx/${tId}.json`);
  }

}
