import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  get pixpassportApiUrl() {
    return process.env.PIXPASSPORT_API_URL ?? "https://api.pixpassport.com";
  },
  get pixpassportApiKey() {
    return required("PIXPASSPORT_API_KEY");
  },
  get mongodbUri() {
    return required("MONGODB_URI");
  },
  get mongodbDb() {
    return process.env.MONGODB_DB ?? "icao_standard_photo";
  },
};
