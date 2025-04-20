import 'dotenv/config';

const getAppConfig = () => {
  const env = process.env.APP_ENV || 'development';

  const isProd = env === 'production';

  const projectId = isProd
    ? 'PROD_PROJECT_ID' // 🟢 Replace with real one from Expo dashboard
    : 'DEV_PROJECT_ID'; // 🔵 Replace with real one too
P
  return {
    expo: {
      name: isProd ? 'Feiken Authenticate' : 'Feiken Dev',
      slug: isProd ? 'feiken-authenticate' : 'feiken-authenticate-dev',
      version: '1.0.0',
      orientation: 'portrait',
      icon: './assets/icon.png', // ✅ Make sure this exists
      scheme: 'feiken',
      userInterfaceStyle: 'light',
      splash: {
        image: './assets/splash.png', // optional
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
      },
      updates: {
        fallbackToCacheTimeout: 0
      },
      assetBundlePatterns: ['**/*'],
      ios: {
        supportsTablet: true,
        bundleIdentifier: isProd
          ? 'com.feiken.authenticate'
          : 'com.feiken.authenticate.dev',
        buildNumber: '1.0.0'
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './icon.png',
          backgroundColor: '#FFFFFF'
        },
        package: isProd
          ? 'com.feiken.authenticate'
          : 'com.feiken.authenticate.dev',
        versionCode: 1
      },
      extra: {
        API_URL: isProd
          ? 'https://feiken-api.weperform.com.my'
          : 'https://feiken-dev-api.weperform.com.my',
        eas: {
          projectId
        }
      }
    }
  };
};

export default getAppConfig();
