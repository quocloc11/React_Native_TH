const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);

// ✅ DÒNG QUYẾT ĐỊNH: Ép Metro đưa .css vào danh sách tìm kiếm
defaultConfig.resolver.sourceExts.push('css');

const config = mergeConfig(defaultConfig, {});

module.exports = withNativeWind(config, { input: './global.css' });