import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

// Colores personalizados de la municipalidad de Calama
const customTokens = {
  color: {
    // Colores principales de la municipalidad
    primary: '#E67E22', // Naranja principal
    primaryLight: '#F39C12',
    primaryDark: '#D35400',
    
    // Colores secundarios
    secondary: '#009688', // Verde azulado
    secondaryLight: '#26A69A',
    secondaryDark: '#00796B',
    
    // Colores de municipalidad
    municipal: '#1A237E', // Azul municipalidad
    municipalLight: '#3F51B5',
    municipalDark: '#0D47A1',
    
    // Colores de estado
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Colores neutros
    background: '#FAFAFA',
    surface: '#FFFFFF',
    
    // Colores de texto
    textPrimary: '#212121',
    textSecondary: '#757575',
    textDisabled: '#BDBDBD',
    
    // Colores de estado de denuncias
    statusReceived: '#FFF3E0', // Naranja claro
    statusInProgress: '#E3F2FD', // Azul claro
    statusResolved: '#E8F5E9', // Verde claro
    statusPending: '#FFEBEE', // Rojo claro
    statusNotResolved: '#FFCDD2', // Rojo más fuerte
  },
}

const appConfig = createTamagui({
  ...config,
  tokens: {
    ...config.tokens,
    ...customTokens,
  },
  themes: {
    ...config.themes,
    // Tema personalizado para la app
    calama: {
      background: customTokens.color.background,
      backgroundHover: customTokens.color.surface,
      backgroundPress: customTokens.color.municipal,
      backgroundFocus: customTokens.color.primaryLight,
      color: customTokens.color.textPrimary,
      colorHover: customTokens.color.textSecondary,
      colorPress: customTokens.color.surface,
      colorFocus: customTokens.color.primary,
      borderColor: customTokens.color.textDisabled,
      borderColorHover: customTokens.color.primary,
      borderColorPress: customTokens.color.primaryDark,
      borderColorFocus: customTokens.color.primary,
    },
  },
})

export type AppConfig = typeof appConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig