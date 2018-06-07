// import {Injectable} from '@angular/core';
// import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
// import {Observable} from 'rxjs';
// import {ApiService} from '../../core/services';
// import {map} from 'rxjs/operators';
// import {AddressInfo} from '../../core/models/address.model';
//
// @Injectable()
// export class AddressResolverService implements Resolve<AddressInfo> {
//   constructor(
//     private api: ApiService
//   ) {
//   }
//
//   resolve(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<any> {
//     return this.api.getAddressUTXOs(route.params.address)
//       .pipe(
//         map(res => {
//             let coinAmount = 0;
//             res.forEach(utxo => coinAmount += utxo.value);
//
//             return {
//               address: route.params.address,
//               transactions: res,
//               coinAmount: coinAmount
//             };
//           }
//         )
//       );
//   }
// }
