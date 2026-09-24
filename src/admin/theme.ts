/**
 * Cybro admin theme.
 *
 * Brand: background #0B1215, primary #ff6316 (orange), secondary #0467df (blue).
 * The design system maps these tokens as follows:
 *   neutral100 → page background, neutral0 → cards/panels/menus,
 *   neutral150/200 → borders, neutral600–900 → text (light-on-dark),
 *   primary600/700 → accents & active links, buttonPrimary* → primary buttons.
 *
 * The brand is dark, so the same palette is applied to both the "light" and "dark"
 * theme slots — the admin looks the same whichever theme an editor picks.
 */

const BRAND = {
  background: '#0B1215',
  primary: '#ff6316',
  secondary: '#0467df',
};

const colors = {
  // Surfaces & text
  neutral0: '#121C21',
  neutral100: BRAND.background,
  neutral150: '#1D2A31',
  neutral200: '#2A3A42',
  neutral300: '#3E515A',
  neutral400: '#7F929B',
  neutral500: '#A3B3BA',
  neutral600: '#A3B3BA',
  neutral700: '#DDE4E7',
  neutral800: '#F2F5F6',
  neutral900: '#FFFFFF',
  neutral1000: '#FFFFFF',

  // Primary — orange
  primary100: '#2A1810',
  primary200: '#6B3018',
  primary500: BRAND.primary,
  primary600: '#FF7A38',
  primary700: '#FF9C6B',
  buttonPrimary500: '#FF7A38',
  buttonPrimary600: BRAND.primary,
  buttonNeutral0: '#FFFFFF',

  // Secondary — blue
  secondary100: '#0A1B30',
  secondary200: '#12386A',
  secondary500: BRAND.secondary,
  secondary600: '#3D8DF0',
  secondary700: '#8DBBF7',

  // Semantic colours, re-tinted for the dark background
  alternative100: '#1B1629',
  alternative200: '#3E2F5E',
  alternative500: '#AC73E6',
  alternative600: '#BD8FEE',
  alternative700: '#E0C1F4',
  success100: '#0F2419',
  success200: '#1F4A33',
  success500: '#5CB176',
  success600: '#6CC487',
  success700: '#C6F0C2',
  warning100: '#2A1F0C',
  warning200: '#5A4015',
  warning500: '#F29D41',
  warning600: '#F4AC5E',
  warning700: '#FAE7B9',
  danger100: '#2A1212',
  danger200: '#5C2420',
  danger500: '#EE5E52',
  danger600: '#F07A70',
  danger700: '#F7B2AB',
};

const focus = 'rgb(255, 99, 22)';

const shadows = {
  filterShadow: '1px 1px 10px rgba(0, 0, 0, 0.45)',
  focus: `inset 2px 0px 0px ${focus}, inset 0px 2px 0px ${focus}, inset -2px 0px 0px ${focus}, inset 0px -2px 0px ${focus}`,
  focusShadow: '0px 0px 6px rgba(255, 99, 22, 0.6)',
  popupShadow: '1px 1px 14px rgba(0, 0, 0, 0.5)',
  tableShadow: '1px 1px 10px rgba(0, 0, 0, 0.3)',
};

const cybroTheme = { colorScheme: 'dark', colors, shadows } as const;

export const theme = {
  light: cybroTheme,
  dark: cybroTheme,
};
