// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//pour les acces de l'api
export const environment = {
  production: false,
    apiURL: "https://51.68.46.67:8000/api_epg",
    api: "https://51.68.46.67:8000",
    //apiURL: "http://127.0.0.1:8000/api_epg",
    //api: "http://127.0.0.1:8000",
    token: null,
    user_id: 0,
    id_compte: 0,
    tarif_id: 0,
    produit: null,
    credit_modal: 0,
    user: [],
    pharmacy: 'pharmacy',
  // apiKey: "dbab1b45-f454-4568-9fcc-47692b8e6319",
   pageItemCount: 500,
   pharmacies: [
    // notre pharmacie
    "666e1cb055766aab443769fb", // dermosphere
    "6670a91855766aab44376b44",
    "667188aea32e56624dcf7091",
    "66719795a32e56624dcf70c0", // Ayitebe
    "66719bd9a32e56624dcf70d9", // avolenzame
    "6682f805f4ecc22f34273536", //test
    // "633c5a44fa44def3b5dbbaa4",
    // "63c288e7d9da78af9d6ccac1",
    // "623a45be1b6f66b46e99a03d",
    // "6237594a2fb38ca16715489f",
    // "6248135de657f409c30acdd4",
    // "6259ac72e657f409c30ace5f",
    // "637e392c125548fd0b09ac60",
    // "649b0894d43eb8ce837d5674"
   ]
  // pageItemCount: 1000,
  // pharmacies: [
  //   "623a45be1b6f66b46e99a03d",
  //   "6237594a2fb38ca16715489f",
  //   "6248135de657f409c30acdd4",
  //   "633c5a44fa44def3b5dbbaa4",
  //   "637e392c125548fd0b09ac60",
  //   "63c2a72fd9da78af9d6ccb54",
  //   "63b441e4d9da78af9d6c6a50",
  //   "63f7523dd9da78af9d6e497c",
  //   "63fb358bf0335bedb2100991"
  // ]

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
