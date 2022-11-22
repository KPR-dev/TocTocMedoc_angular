// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: "https://epg-supervisor-api.pivot40.tech",
  apiKey: "dbab1b45-f454-4568-9fcc-47692b8e6319",
  pharmacies: [
    "623a45be1b6f66b46e99a03d",
    "6237594a2fb38ca16715489f",
    "6248135de657f409c30acdd4",
    "6259ac72e657f409c30ace5f",
    "633c5a44fa44def3b5dbbaa4"
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
