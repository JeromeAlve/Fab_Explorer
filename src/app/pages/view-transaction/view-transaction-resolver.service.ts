import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Tx } from '../../core/models';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services';

@Injectable()
export class ViewTransactionResolverService implements Resolve<Tx> {
  constructor(
    private api: ApiService
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Tx> {

    return this.api.getTxInfo(route.params.transactionHash);
  }
}
