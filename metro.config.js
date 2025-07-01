// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configuración específica para Tamagui
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-svg': '@expo/react-native-svg',
  // Alias para resolver rutas src/
  '@': path.resolve(__dirname, 'src'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@services': path.resolve(__dirname, 'src/services'),
  '@hooks': path.resolve(__dirname, 'src/hooks'),
  '@types': path.resolve(__dirname, 'src/types'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@constants': path.resolve(__dirname, 'src/constants'),
};

config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;