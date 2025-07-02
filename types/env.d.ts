declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SAP_BASE_URL: string;
      EXPO_PUBLIC_SAP_CLIENT_ID: string;
      EXPO_PUBLIC_SAP_SERVICE_URL: string;
      EXPO_PUBLIC_API_KEY: string;
      EXPO_PUBLIC_SAP_USERNAME: string;
      EXPO_PUBLIC_SAP_PASSWORD: string;
      EXPO_PUBLIC_SAP_SALES_ORDER_API: string;
    }
  }
}

export {};