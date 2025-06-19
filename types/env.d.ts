declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SAP_BASE_URL: string;
      EXPO_PUBLIC_SAP_CLIENT_ID: string;
      EXPO_PUBLIC_SAP_SERVICE_URL: string;
      EXPO_PUBLIC_API_KEY: string;
    }
  }
}

export {};