import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { timer } from 'rxjs';

@Injectable()
export class CacheService {
  private _cache = localStorage;
  private _expiryTime = environment.cacheExpireTime;
  private _autoExpireSearch = environment.autoExpireSearch * 1000;
  private _expiryRunner = timer(0, this._autoExpireSearch);

  constructor() {
    this._expiryRunner.subscribe(_ => this.autoEvictExpired());
  }

  private async autoEvictExpired() {
    const dataToRemove = [];

    for (const i in this._cache) {
      if (this._cache.hasOwnProperty(i)) {
        const v = this._cache.getItem(i);
        if (!!v && this.isExpired(JSON.parse(v).timestamp)) {
          dataToRemove.push(i);
        }
      }
    }

    for (let i = 0; i < dataToRemove.length; ++i) {
      this._cache.removeItem(dataToRemove[i]);
    }
  }

  private isExpired(timestamp: number) {
    return (Date.now() / 1000 - this._expiryTime) > timestamp;
  }

  public write(k: string, v: any, type: string) {
    const data = {
      timestamp: Date.now() / 1000,
      payload: v,
      type: type
    };
    this._cache.setItem(k, JSON.stringify(data));
  }

  public get(k: string): any {
    const data = this._cache.getItem(k);

    if (!data) {
      return undefined;
    }

    const parsedData = JSON.parse(data);
    if (!!parsedData.timestamp && this.isExpired(parsedData.timestamp)) {
      this._cache.removeItem(k);
      return undefined;
    } else {
      console.log(`Loading ${k} from cache`);
      return parsedData;
    }
  }
}
