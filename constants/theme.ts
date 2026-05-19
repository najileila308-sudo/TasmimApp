import { Platform } from 'react-native';

const brandBlue = '#69A8FF';
const brandMint = '#62C9B2';

export const AppColors = {
  bg: '#061833',
  bgSoft: '#0D2759',
  surface: 'rgba(10, 35, 78, 0.9)',
  surfaceAlt: 'rgba(103, 181, 255, 0.12)',
  surfaceTint: 'rgba(103, 181, 255, 0.2)',
  border: 'rgba(171, 215, 255, 0.18)',
  accent: brandBlue,
  accentStrong: '#4CA3FF',
  accentSoft: 'rgba(103, 181, 255, 0.18)',
  mint: brandMint,
  mintStrong: '#31AE95',
  mintSoft: 'rgba(98, 201, 178, 0.14)',
  blue: '#4C8CF4',
  amber: '#F8B84D',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(227, 239, 255, 0.76)',
  textMuted: 'rgba(184, 207, 232, 0.6)',
  success: '#22A57A',
  danger: '#E66D78',
  white: '#FFFFFF',
  shadow: 'rgba(4, 18, 43, 0.45)',
} as const;

export const Colors = {
  light: {
    text: AppColors.textPrimary,
    background: AppColors.bg,
    tint: brandBlue,
    icon: AppColors.textMuted,
    tabIconDefault: '#90A9C3',
    tabIconSelected: brandBlue,
  },
  dark: {
    text: AppColors.textPrimary,
    background: AppColors.bg,
    tint: brandBlue,
    icon: AppColors.textMuted,
    tabIconDefault: '#90A9C3',
    tabIconSelected: brandBlue,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
