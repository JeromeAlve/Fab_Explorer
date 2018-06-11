import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { ApiService } from './api.service';
import { timer } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Chain } from '../models';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable()
export class StateService {
  private _currentChain = new ReplaySubject<Chain>(1);
  private _topBlockHash = new ReplaySubject<string>(1);

  updateTimer: Observable<number>;
  timerStopper: Subject<void>;

  constructor(private api: ApiService) {
    this.timerStopper = new Subject();
    this.init();
    console.log('State service loaded...');
  }

  private createTimer() {
    this.updateTimer = timer(environment.updateFreq, environment.updateFreq)
      .pipe(
        takeUntil(this.timerStopper)
      );
  }

  private sendUpdate = (data) => {
    console.log('Updating chain info...');
    this._currentChain.next(data);
    this._topBlockHash.next(data.bestblockhash);
  }

  get currentChain(): Observable<Chain> {
    return this._currentChain.asObservable();
  }

  get topBlockHash(): Observable<string> {
    return this._topBlockHash.asObservable();
  }

  init() {
    this.api.getChainInfo().subscribe(data => this.sendUpdate(data));
  }

  stopStateUpdate() {
    this.timerStopper.next();
    this.updateTimer = undefined;
    console.log('Stopped periodic update');
  }

  startStateUpdate() {
    if (!this.updateTimer) {
      console.log('Update timer does not exist, creating new one...');
      this.createTimer();
    }

    this.updateTimer.subscribe(
      _ => {
        this.api.getChainInfo().subscribe(this.sendUpdate);
      }
    );
  }
}

