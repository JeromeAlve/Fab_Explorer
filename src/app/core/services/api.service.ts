import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Block, Chain, Tx, UTXO } from '../models';
import { Observable } from 'rxjs';
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
    const inCache: Block = this.cache.get(bId);
    if (!!inCache && !!inCache.nextblockhash) {
      return of(inCache);
    }
    return this.http.get<Block>(`${this.restAPIBase}/block/${bId}.json`)
      .pipe(
        tap(data => this.cache.write(bId, data))
      );
  }

  getTxInfo(tId: string): Observable<Tx> {
    console.log(`Loading transaction ${tId}`);
    const inCache: Tx = this.cache.get(tId);
    if (!!inCache) {
      return of(inCache);
    }
    return this.http.get<Tx>(`${this.restAPIBase}/tx/${tId}.json`)
      .pipe(
        tap(data => this.cache.write(tId, data))
      );
  }

}
