const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuración específica para Tamagui
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-svg': '@expo/react-native-svg',
};

config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;