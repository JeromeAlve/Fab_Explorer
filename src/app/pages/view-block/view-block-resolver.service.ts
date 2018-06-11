import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Block } from '../../core/models';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services';

@Injectable()
export class ViewBlockResolverService implements Resolve<Block> {
  constructor(
    private api: ApiService
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Block> {
    return this.api.getBlockInfo(route.params.blockHash);
  }
}
