import 'dotenv/config';

export default ({ config }) => {
  const env = process.env.APP_ENV || 'development'; // Set from EAS profile
  const isProd = env === 'production';

  return {
    ...config,
    name: isProd ? 'Feiken Authenticate' : 'Feiken Authenticate Dev',
    slug: isProd ? 'Feiken-Authenticate' : 'Feiken-Authenticate-Dev',
    ios: {
      ...config.ios,
      bundleIdentifier: isProd
        ? 'com.keatyat.FeikenAuthenticate'
        : 'com.keatyat.FeikenAuthenticateDev',
    },
    android: {
      ...config.android,
      package: isProd
        ? 'com.keatyat.FeikenAuthenticate'
        : 'com.keatyat.FeikenAuthenticateDev',
    },
    extra: {
      ...config.extra,
      env,
      API_URL: isProd
        ? 'https://feiken-api.weperform.com.my'
        : 'https://feiken-dev-api.weperform.com.my',
    },
  };
};
