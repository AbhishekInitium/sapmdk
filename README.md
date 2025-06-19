# bolt-expo-nativewind

A starter Expo (React Native) project with SAP integration, NativeWind, and modern navigation. 

## Features
- Expo Router navigation
- SAP service integration (with mock data fallback)
- TypeScript support
- Custom error boundary and loading spinner components
- Google Fonts (Inter, Roboto)
- Ready for web, iOS, and Android

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Expo Go](https://expo.dev/client) app on your mobile device (for running on a real device)

## Getting Started

1. **Clone the repository**
   ```sh
   git clone (https://github.com/AbhishekInitium/sapmdk)
   cd project-sapmdk
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following (replace with your SAP credentials):
   ```env
   EXPO_PUBLIC_SAP_BASE_URL=your_sap_base_url
   EXPO_PUBLIC_SAP_CLIENT_ID=your_sap_client_id
   EXPO_PUBLIC_SAP_SERVICE_URL=your_sap_service_url
   EXPO_PUBLIC_API_KEY=your_api_key
   ```
   > These are used for SAP service integration. If not set, the app will use mock data.

4. **Start the development server**
   ```sh
   npm run dev
   ```
   This will launch the Expo Dev Tools in your browser.

5. **Run the app**
   - **On your phone:**
     - Open the Expo Go app and scan the QR code from the terminal or browser.
   - **On an emulator/simulator:**
     - For Android: Start an emulator via Android Studio, then click "Run on Android device/emulator" in Expo Dev Tools.
     - For iOS: On macOS, use Xcode's iOS Simulator and click "Run on iOS simulator".
   - **On the web:**
     - Press `w` in the terminal or click "Run in web browser" in Expo Dev Tools.

## Scripts
- `npm run dev` — Start the Expo development server
- `npm run build:web` — Build the app for web
- `npm run lint` — Lint the project

## Project Structure
- `app/` — App entry points and navigation
- `components/` — Reusable UI components (ErrorBoundary, LoadingSpinner)
- `hooks/` — Custom React hooks
- `services/` — SAP integration service
- `assets/` — Images and static assets
- `types/` — TypeScript type definitions

## Environment Variables
These must be set in a `.env` file or your environment:
- `EXPO_PUBLIC_SAP_BASE_URL`
- `EXPO_PUBLIC_SAP_CLIENT_ID`
- `EXPO_PUBLIC_SAP_SERVICE_URL`
- `EXPO_PUBLIC_API_KEY`

## Notes
- If SAP environment variables are not set, the app will use mock data for employees, documents, and analytics.
- The project uses [Expo Router](https://expo.github.io/router/docs) for navigation.
- TypeScript strict mode is enabled.

## License
MIT 
