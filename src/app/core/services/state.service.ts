import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {timer} from 'rxjs';
import {Observable} from 'rxjs/internal/Observable';
import {Chain} from '../models';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';


@Injectable()
export class StateService {
  currentChain: BehaviorSubject<Chain>;
  topBlockHash: BehaviorSubject<string>;

  constructor(private api: ApiService) {
    this.currentChain = new BehaviorSubject<Chain>(null);
    this.topBlockHash = new BehaviorSubject<string>(null);
    timer(0, 5000).subscribe(
      _ => {
        api.getChainInfo().subscribe(
          data => {
            console.log('Updating chain info...');
            this.topBlockHash.next(data.bestblockhash);
            this.currentChain.next(data);
          }
        );
      }
    );
  }

  getChainInfo(): Observable<Chain> {
    return this.currentChain.asObservable();
  }

  getLatestBlockHash(): Observable<string> {
    return this.topBlockHash.asObservable();
  }
}

