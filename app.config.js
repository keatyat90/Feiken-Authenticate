import 'dotenv/config';

const getAppConfig = () => {
  const env = process.env.APP_ENV || 'production';

  const isProd = env === 'production';

  const projectId = isProd
    ? process.env.PROD_PROJECT_ID || "288ca3ba-fee1-446a-a62c-2c114f6ed3e3"
    : process.env.DEV_PROJECT_ID  || '1239f45d-5b94-41b5-b03c-21c35384e7be';

  return {
    expo: {
      name: isProd ? 'Feiken Authenticate' : 'Feiken Dev',
      slug: isProd ? 'Feiken-Authenticate' : 'feiken-authenticate-dev',
      version: '1.0.1',
      orientation: 'portrait',
      icon: './assets/icon.png', // ✅ Make sure this exists
      scheme: 'feiken',
      userInterfaceStyle: 'light',
      splash: {
        image: './assets/splash-icon.png', // optional
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
