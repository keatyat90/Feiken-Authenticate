module.exports = function (api) {
  // ✅ Dynamic caching to avoid “already configured” error
  api.cache(() => process.env.NODE_ENV);

  const isWeb = api.env() === 'web';
  const plugins = [];

  if (!isWeb) {
    plugins.push([
      'module:react-native-dotenv',
      {
        moduleName: 'react-native-dotenv',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ]);
  }

  // 👇 Always last
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
