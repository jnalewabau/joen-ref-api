const projectName = process.env.PROJECT_NAME;
const sdkKey = process.env.SDK_KEY;
const sdkId = process.env.SDK_ID;
const clientEmail = process.env.SA_CLIENT_EMAIL;
const clientId = process.env.SA_CLIENT_ID;
const certUrl = process.env.SA_CERT_URL;

if (!projectName || !sdkKey || !sdkId || !clientEmail || !clientId || !certUrl) {
  throw new Error(`Missing environment variables for service account`);
}

export const SA_PROJECT_NAME = projectName;
export const SA_SDK_KEY = sdkKey;
export const SA_SDK_ID = sdkId;
export const SA_CLIENT_EMAIL = clientEmail;
export const SA_CLIENT_ID = clientId;
export const SA_CERT_URL = certUrl;
