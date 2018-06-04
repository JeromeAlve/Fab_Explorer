import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {timer} from 'rxjs';
import {Observable} from 'rxjs/internal/Observable';
import {Chain} from '../models';
import {Subject} from 'rxjs/internal/Subject';


@Injectable()
export class StateService {
  currentChain: Subject<Chain>;

  constructor(private api: ApiService) {
    this.currentChain = new Subject<Chain>();
    timer(0, 5000).subscribe(
      _ => {
        api.getChainInfo().subscribe(
          data => {
            console.log('Updating chain info...');
            this.currentChain.next(data);
          }
        );
      }
    );
  }

  getChainInfo(): Observable<Chain> {
    return this.currentChain.asObservable();
  }
}

