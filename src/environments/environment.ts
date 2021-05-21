// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  deploymentKey: 'cVG5AP978vlKNH_RE0n1HmRBG-cJv--3YlQ1_',
  ipAddressServiceUrl: 'https://api.ipregistry.co/?key=d5hgaqzfife540',
  // urlBase: 'http://localhost:3000/dev/',
  urlBase: 'https://jqru2dn373.execute-api.us-east-1.amazonaws.com/dev/',
  resUrlBase: 'https://cantos.s3.amazonaws.com/',
  firebase: {
    apiKey: 'AIzaSyAswmxggFm_r2K649m9UKNnDgmIocd79Hs',
    authDomain: 'cantoapp-e76f3.firebaseapp.com',
    databaseURL: 'https://cantoapp-e76f3.firebaseio.com',
    projectId: 'cantoapp-e76f3',
    storageBucket: 'cantoapp-e76f3.appspot.com',
    messagingSenderId: '1003348387064',
    appId: '1:1003348387064:web:435e8553caba471daec70d',
    measurementId: 'G-KYK6T99GX6'
  },

  paypal: 'AbHpzq_qdgMpeLlU7YQoRkXOQl6JhLzJoLnzYRUKDFglZnnESZ-PmVtcUfJuLc37E89IDlazzikHIQyd',
  plans: {
    basic3: 'P-2DU318024S802745KMAIJZ4Y',
    basic6: 'P-828250819E0175312MAIJ2ZQ',
    basic12: 'P-8L291724X7691683SMAIJ33I',
    premium3: 'P-1CD37859F0256511TMAIJ6OA',
    premium6: 'P-58363112D9751035SMAIJ7XQ',
    premium12: 'P-2MN97287RP670784XMAIJ43I',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
