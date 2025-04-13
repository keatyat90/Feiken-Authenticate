import 'dotenv/config';

export default ({ config }) => {
  const envFile = process.env.ENVFILE || '.env';
  require('dotenv').config({ path: envFile });

  return {
    ...config,
    extra: {
      apiUrl: process.env.API_URL,
    },
  };
};
