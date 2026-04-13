module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          // ✅ ĐÃ THÊM '.css' VÀO CUỐI DANH SÁCH NÀY
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json', '.css'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@utils': './src/utils',
            '@types': './src/types',
            '@hooks': './src/hooks',
            '@services': './src/services',
            '@store': './src/store',
          },
        },
      ],
      // Đã xóa 'nativewind/babel' ở đây
      // ⚠️ LUÔN LUÔN CUỐI CÙNG
      'react-native-reanimated/plugin',
    ],
  };
};  