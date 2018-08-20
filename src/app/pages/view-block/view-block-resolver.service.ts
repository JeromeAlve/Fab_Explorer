import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { flatMap } from 'rxjs/operators';

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
    if (isNaN(Number(route.params.blockHash))) {
      return this.api.getBlockInfo(route.params.blockHash);
    }

    return this.api.getBlockHash(Number(route.params.blockHash))
      .pipe(
        flatMap(
          blockHash => this.api.getBlockInfo(blockHash)
        )
      );
  }
}
