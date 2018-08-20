import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { script } from 'bitcoinjs-lib';
import { environment } from '../../../environments/environment';
<<<<<<< HEAD
import { Block, Chain, Tx, UTXO, ChainTip } from '../models';
import { Observable, of } from 'rxjs';
import { tap, publishReplay } from 'rxjs/operators';
=======
import { AddressBalance, Block, Chain, Tx, UTXO } from '../models';
import { Observable, of } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { AddressTransactions } from '../models/address.model';
>>>>>>> 15320edc2c6e9c9e1e1ca314d0f8cce3f66fd7ce
import { CacheService } from './cache.service';
import number = script.number;

@Injectable()
export class ApiService {

  restAPIBase: string = environment.restAPIBase;
  fabAPIBase: string = environment.fabAPIBase;
  utxoAPIBase: string = environment.utxoAPIBase;

  constructor(
    private http: HttpClient,
    private cache: CacheService
  ) {
  }

  getBlockHash(height: number): Observable<string> {
    console.log(`Loading block hash for height ${height}`);
    const inCache = this.cache.get(`block-height-${height}`);
    if (!!inCache && inCache.type === 'block-height') {
      return of(inCache.payload);
    }
    return this.http.get(`${this.fabAPIBase}/getblockhash/${height}`, {responseType: 'text'})
      .pipe(
        tap(data => this.cache.write(`block-height-${height}`, data, 'block-height'))
      );
  }

  getChainTips(): Observable<ChainTip[]> {
    console.log(`Loading chain tips`);
    return this.http.get<ChainTip[]>(`${this.fabAPIBase}/getchaintips`);
  }

  getAddressUTXOs(address: string): Observable<UTXO[]> {
    console.log(`Loading address info of ${address}`);
    const inCache = this.cache.get(address);
    if (!!inCache && inCache.type === 'address') {
      return of(inCache.payload);
    }
    return this.http.get<UTXO[]>(`${this.fabAPIBase}/unspenttransactionpolicy/${address}`)
      .pipe(
        tap(data => this.cache.write(address, data, 'address', 'short'))
      );
  }

  getAccountBalance(address: string): Observable<AddressBalance> {
    const inCache = this.cache.get(`${address}-balance`);
    if (!!inCache && inCache.type === 'block-balance') {
      return of(inCache.payload);
    }
    return this.http.get<AddressBalance>(`${this.utxoAPIBase}/balance/${address}`)
      .pipe(
        tap(data => this.cache.write(`${address}-balance`, data, 'address-balance', 'short'))
      );
  }

  getAddressTransactions(address: string): Observable<AddressTransactions> {
    return this.http.get<AddressTransactions>(`${this.utxoAPIBase}/transactions/${address}`);
  }

  getTopAddresses(start: number = 0, end: number = 10): Observable<{result: AddressBalance[], totalAddrNum: number}> {
    return this.http.get<{result: AddressBalance[], totalAddrNum: number}>(`${this.utxoAPIBase}/top-addresses`, {
      params: {
        start: start.toString(),
        end: end.toString()
      }
    })
      .pipe(
        flatMap(data => of({result: data.result, totalAddrNum: data.totalAddrNum}))
      );
  }

  getMarketCap(): Observable<{marketCap: number}> {
    return this.http.get<{marketCap: number}>(`${this.utxoAPIBase}/market-cap`);
  }

  getChainInfo(): Observable<Chain> {
    console.log('Loading latest chain');
    const inCache = this.cache.get('chain');
    if (!!inCache && inCache.type === 'chain') {
      console.log('Cache hit chain');
      return of(inCache.payload);
    }
    return this.http.get<Chain>(`${this.restAPIBase}/chaininfo.json`)
      .pipe(
        tap(data => this.cache.write('chain', data, 'chain', 'short'))
      );
  }

  getBlockInfo(bId: string): Observable<Block> {
    console.log(`Loading block ${bId}`);
    const inCache = this.cache.get(bId);
    if (!!inCache && !!inCache.payload && !!inCache.payload.nextblockhash && inCache.type === 'block') {
      console.log(`Cache hit ${bId}`);
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
      console.log('Cache hit tx');
      return of(inCache.payload);
    }
    return this.http.get<Tx>(`${this.restAPIBase}/tx/${tId}.json`)
      .pipe(
        tap(data => this.cache.write(tId, data, 'tx'))
      );
  }

}
