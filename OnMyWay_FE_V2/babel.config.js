module.exports = api => {
  const isTest = api.env('test');
  const dotenvPlugin = [
    'module:react-native-dotenv',
    {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true,
    },
  ];

  return {
    presets: isTest
      ? ['module:@react-native/babel-preset']
      : [
          ['module:@react-native/babel-preset', {jsxImportSource: 'nativewind'}],
          'nativewind/babel',
        ],
    plugins: isTest
      ? [dotenvPlugin]
      : [dotenvPlugin, 'react-native-worklets/plugin'],
  };
};
