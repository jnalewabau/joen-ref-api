// spell-checker:ignore serviceaccount projectname sdkkey sdkid clientemail clientid certurl
import * as functions from 'firebase-functions';

// Read the service account information from firebase functions config
// We are unable to read these variables directly the .env support in Firebase as the
// generated values (process.env) are only available inside a cloud function
// Also using lowercase for variables due to Firebase restrictions

console.log({ functionsConfig: functions.config() });

const serviceAccountConfig = functions.config().serviceaccount;

console.log({ serviceAccountConfig });

// if (
//   serviceAccountConfig === undefined ||
//   serviceAccountConfig.projectname === undefined ||
//   serviceAccountConfig.sdkkey === undefined ||
//   serviceAccountConfig.sdkid === undefined ||
//   serviceAccountConfig.clientemail === undefined ||
//   serviceAccountConfig.clientid === undefined ||
//   serviceAccountConfig.certurl === undefined
// ) {
//   throw new Error('Service account configurations not found or incomplete');
// }

// export const SA_PROJECT_NAME = serviceAccountConfig.projectname;
// export const SA_SDK_KEY = serviceAccountConfig.sdkkey;
// export const SA_SDK_ID = serviceAccountConfig.sdkid;
// export const SA_CLIENT_EMAIL = serviceAccountConfig.clientemail;
// export const SA_CLIENT_ID = serviceAccountConfig.clientid;
// export const SA_CERT_URL = serviceAccountConfig.certurl;

export const SA_PROJECT_NAME = 'joen-ref-api';
export const SA_SDK_KEY =
  '-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCQS75T15Q0835F\\nGs7TciJKJtlN/se70In5Ivc7xDu8mEgBY9jvbUbl87+UlYohAEZ4rhSDcHJu+fL5\\nFYBSvDtNSZ6ZIjmaQyH1vTZIq24pC1UQmEMzITBvHiUyzmLcPtmTMP1a+JBjrnrT\\nonQmqAcnHhha1ntJidvQwCnRYsILhRiGYq2ZV/6Td67cy7vBnR3EyrhJzV8PoIZO\\nd9YKTLKmm8ehLh4UxeLxUnMmFv7QqlmzzngM0a8nDaIhm/Rns9WfJAxcFDDFHSSr\\ncS7tT82c4/KeBnoiuMkftrp1GUWQVKq9DCR4luSafcaJIbn9v+JYxe4du5jffBPa\\nm3ZymPG5AgMBAAECggEAQhCDwBRMNWAkOFR5TGMNowCdbnHPlcR5Xzksk88ZAJSC\\nJyzFVn2kP8U1OjyrJMfg/ADLwJAbvIawwW0gNwEab5zcwcTjNac15bJvJ59hjOY0\\n2Ke14LN53u4g3t2Scr9N02/TF7MFPLZWYw4Wetpkh/rl8LURdk5pd2571vON30Kt\\nRObmQ4TNn5kKC8GqUL0wNv0M+zX6qGFVcqBwNKMSORYFdeBnecLGl7gAtLRaY6D+\\n4KozL+TLR7CzodQtoEKy5Jf/UJ6asHbDV/SXYMgkmDwDFzztO9cSIYXRPC0Y+EEp\\nqCsWHJNqd1NHMkZxlrEZhOijpzqEVVC9+sOxEObiPwKBgQDAM36PUfW7t8W4LXMk\\nYjANq0ec8AjjuqWXt/ucp8pzxGiMgSuu436i0ugpDNX8N4ukQOEietfzsiEAkr7/\\nkKO5bN1uxzshTgKBlOSvYgnMtU3qEjrrg4dBWnNc5waQeyAcupOjj7bKsTR+yAS+\\ne6ysANIHLb/pJ4EHW2OCC4B9XwKBgQDAMXHy8UJioIe9GOUhWFch4wsFvvjAtZBt\\nVyRg05c7EHUQ4pcoOmRyiqcVTWMGiAtrHDoBmqB79HUW973TCal+M90am/flVsyF\\nlm6bzE6CwUPEbSG+y1EzVcmZDAvLndLJIcnskhgiHM2iKSlE9Pqz9gPk9Y2NtDV/\\nWOjS8LjP5wKBgB1GOpqdwy3qWcUptwXtpqAOXIP8033MKfin3z0HGYD0g3ATJJIo\\nuFsYgJ/wAo+97hkAgMn9p/LISNqLf2fxod5WRIvg8JKsDRmrkgFcj12Mp+dlC3Bf\\nwjQkELovvgI3nraBfIdHFnJc9z/wOzjAIZa5MURCpZ5fk/mI4+kk01dFAoGBAKYa\\n1dHTI73b4hTTbEyKbhvyfzdDGvhqs11coCszFBRPH+4s99kjxmacYNVvYbNmZv/2\\nkEeMnUEkQQJNsXiwdBWHu4Ng4zoJ749ROV1bkUs+v1QHwc+FJzPH5AlrONKNH30H\\nv92/Ui5BWJPbITjgxcA9UpZShzm+UzIx5F9S/1dnAoGAGWlHKrxRa4uHlyAZ07gM\\nJltjQ7poeIYFfrt0OWfCXIU3Qaa7SagR1yi2a90I+mpy6HaQngsTNGGGYzi2mdMV\\n8uv/Atk09z70YlwuyB1tzAQJHbQfd2+6gjtq2C2LbuhqFdhloBKn8/QNYSAM2Fs/\\nWLmDvT9jGGjfC3e28KUP8WY=\\n-----END PRIVATE KEY-----\\n';
export const SA_SDK_ID = '694d0751aa692d3cc55e31efb06f40762d3bdee6';
export const SA_CLIENT_EMAIL = 'firebase-adminsdk-gwjvq@joen-ref-api.iam.gserviceaccount.com';
export const SA_CLIENT_ID = '100910984883901198962';
export const SA_CERT_URL = 'firebase-adminsdk-gwjvq@joen-ref-api.iam.gserviceaccount.com';
