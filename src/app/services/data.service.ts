import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ChainInfo} from '../models/chainInfo';
import {BlockInfo} from '../models/blockinfo';
import {Tx} from '../models/blockinfo';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class DataService {

  // configURL : string = 'http://35.182.160.212:18667/rest/' ; // Testnet
  configURL = 'http://18.130.8.117:8667/rest/'; // mainnet
  curFiveBlocks: BlockInfo[] = [];

  constructor(private http: HttpClient) {
  }


  getChainInfo(): Observable<ChainInfo> {
    return this.http.get<ChainInfo>(this.configURL + 'chaininfo.json');
  }

  getBlockInfo(bId: string): Observable<BlockInfo> {
    return this.http.get<BlockInfo>(this.configURL + 'block/' + bId + '.json');
  }

  getTxInfo(tId: string): Observable<Tx> {
    return this.http.get<Tx>(this.configURL + 'tx/' + tId + '.json');
  }

}
