import 'dotenv/config';

const getAppConfig = () => {
  const env = process.env.EXPO_PUBLIC_APP_ENV || 'production';
  const isProd = env === 'production';

  const projectId = isProd
    ? process.env.PROD_PROJECT_ID || '288ca3ba-fee1-446a-a62c-2c114f6ed3e3'
    : process.env.DEV_PROJECT_ID || '1239f45d-5b94-41b5-b03c-21c35384e7be';

  return {
    expo: {
      name: isProd ? 'Feiken Authenticate' : 'Feiken Auth Dev',
      slug: isProd ? 'Feiken-Authenticate' : 'feiken-authenticate-dev',
      scheme: 'feiken',
      version: '1.0.1', // marketing version (App Store / Play Store)
      orientation: 'portrait',
      icon: './assets/icon.png',
      userInterfaceStyle: 'light',
      splash: {
        image: './assets/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
      assetBundlePatterns: ['**/*'],
      updates: {
        fallbackToCacheTimeout: 0,
      },
      ios: {
        supportsTablet: true,
        bundleIdentifier: isProd
          ? 'com.feiken.authenticate'
          : 'com.feiken.authenticate.dev',
        buildNumber: '7', // increment on every iOS submit
        infoPlist: {
          NSCameraUsageDescription:
            'We use your camera to scan QR codes printed on Feiken products to verify authenticity. No images or video are recorded or stored.',
        },
      },
      android: {
        package: isProd
          ? 'com.feiken.authenticate'
          : 'com.feiken.authenticate.dev',
        versionCode: 11, // increment on every Android submit
        permissions: ['CAMERA'],
        cameraPermission:
          'We use your camera to scan QR codes printed on Feiken products to verify authenticity. No images or video are recorded or stored.',
        adaptiveIcon: {
          foregroundImage: './assets/adaptive-icon.png',
          backgroundColor: '#FFFFFF',
        },
        compileSdkVersion: 35,
        targetSdkVersion: 35,
        minSdkVersion: 23 
      },
      extra: {
        EXPO_PUBLIC_APP_ENV: env,
        EXPO_PUBLIC_API_URL: isProd
          ? 'https://feiken-api.weperform.com.my'
          : 'https://feiken-dev-api.weperform.com.my',
        eas: { projectId },
      },
    },
  };
};

export default getAppConfig();
