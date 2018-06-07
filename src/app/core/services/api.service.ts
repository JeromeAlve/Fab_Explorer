import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Block, Chain, Tx, UTXO} from '../models';
import {Observable} from 'rxjs';

@Injectable()
export class ApiService {

  restAPIBase: string = environment.restAPIBase;
  fabAPIBase: string = environment.fabAPIBase;

  constructor(private http: HttpClient) {
  }

  getBlockHash(height: number): Observable<string> {
    return this.http.get(`${this.fabAPIBase}/getblockhash/${height}`, {responseType: 'text'});
  }

  getAddressUTXOs(address: string): Observable<UTXO[]> {
    return this.http.get<UTXO[]>(`${this.fabAPIBase}/unspenttransactionpolicy/${address}`);
  }

  getChainInfo(): Observable<Chain> {
    return this.http.get<Chain>(`${this.restAPIBase}/chaininfo.json`);
  }

  getBlockInfo(bId: string): Observable<Block> {
    return this.http.get<Block>(`${this.restAPIBase}/block/${bId}.json`);
  }

  getTxInfo(tId: string): Observable<Tx> {
    return this.http.get<Tx>(`${this.restAPIBase}/tx/${tId}.json`);
  }

}
