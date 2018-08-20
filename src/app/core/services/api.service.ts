import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Block, Chain, Tx, UTXO, ChainTip } from '../models';
import { Observable, of } from 'rxjs';
import { tap, publishReplay } from 'rxjs/operators';
import { CacheService } from './cache.service';

@Injectable()
export class ApiService {

  restAPIBase: string = environment.restAPIBase;
  fabAPIBase: string = environment.fabAPIBase;

  constructor(
    private http: HttpClient,
    private cache: CacheService
  ) {
  }

  getBlockHash(height: number): Observable<string> {
    console.log(`Loading block hash for height ${height}`);
    return this.http.get(`${this.fabAPIBase}/getblockhash/${height}`, {responseType: 'text'});
  }

  getChainTips(): Observable<ChainTip[]> {
    console.log(`Loading chain tips`);
    return this.http.get<ChainTip[]>(`${this.fabAPIBase}/getchaintips`);
  }

  getAddressUTXOs(address: string): Observable<UTXO[]> {
    console.log(`Loading address info of ${address}`);
    return this.http.get<UTXO[]>(`${this.fabAPIBase}/unspenttransactionpolicy/${address}`);
  }

  getChainInfo(): Observable<Chain> {
    console.log('Loading latest chain');
    return this.http.get<Chain>(`${this.restAPIBase}/chaininfo.json`);
  }

  getBlockInfo(bId: string): Observable<Block> {
    console.log(`Loading block ${bId}`);
    const inCache = this.cache.get(bId);
    if (!!inCache && !!inCache.nextblockhash && inCache.type === 'block') {
      return of(inCache.payload);
    }
    return this.http.get<Block>(`${this.restAPIBase}/block/${bId}.json`)
      .pipe(
        tap(data => this.cache.write(bId, data, 'block'))
      );
  }

  getTxInfo(tId: string): Observable<Tx> {
    console.log(`Loading transaction ${tId}`);
    const inCache = this.cache.get(tId);
    if (!!inCache && inCache.type === 'tx') {
      return of(inCache.payload);
    }
    return this.http.get<Tx>(`${this.restAPIBase}/tx/${tId}.json`)
      .pipe(
        tap(data => this.cache.write(tId, data, 'tx'))
      );
  }

}
