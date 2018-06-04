import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';

import {catchError} from 'rxjs/operators';
import {Block} from '../../core/models';
import {Observable} from 'rxjs';
import {ApiService} from '../../core/services';

@Injectable()
export class ViewBlockResolverService implements Resolve<Block> {
  constructor(
    private api: ApiService,
    private router: Router
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {

    return this.api.getBlockInfo(route.params.blockHash);
  }
}
