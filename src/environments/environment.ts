// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//pour les acces de l'api
export const environment = {
  production: false,
  //  apiURL: "https://epg-supervisor-api.pivot40.tech",
    apiURL: "http://31.207.35.25:8000/api_epg",
    api: "http://31.207.35.25:8000",
    // apiURL: "http://localhost:8000/api_epg",
    // api: "http://localhost:8000",
    token: null,
    user_id: 0,
    id_compte: 0,
    tarif_id: 0,
    produit: null,
    user: [],
  // apiKey: "dbab1b45-f454-4568-9fcc-47692b8e6319",
   pageItemCount: 500,
   pharmacies: [
    // notre pharmacie
    "633c5a44fa44def3b5dbbaa4",
    // "63c288e7d9da78af9d6ccac1",
    // "633c5a44fa44def3b5dbbaa4",
    // "6259ac72e657f409c30ace5f",
      // "633c5a44fa44def3b5dbbaa4",
      // "623a45be1b6f66b46e99a03d",
      // "6237594a2fb38ca16715489f",
      // "6248135de657f409c30acdd4",
      // "6259ac72e657f409c30ace5f",
      // "633c5a44fa44def3b5dbbaa4",
      // "637e392c125548fd0b09ac60"
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
