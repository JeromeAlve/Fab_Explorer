// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  updateFreq: 35,
  restAPIBase: 'http://fabexplorer.info:8667/rest',
  fabAPIBase: 'http://fabexplorer.info:9001/fabapi',
  utxoAPIBase: 'http://fabexplorer.info:8666',
  cacheExpireTime: 60 * 60 * 24,
  autoExpireSearch: 60 * 2
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
