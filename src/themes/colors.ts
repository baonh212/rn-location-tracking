const colors = {
  primary: '#48A7F8',
  black: '#1F1F1F',
  white: '#ffffff',
  gray: '#454545',
  red: '#ff0009',
  error: '#FF5247',
  success: '#23C16B',
  warning: '#FFB323',
  blackOpacity: 'rgba(0,0,0,0.4)',
  lightGray: '#adadad',
  background: '#F6F7FA',
} as const;

const getColorOpacity = (color: string, opacity: number): string => {
  if (opacity >= 0 && opacity <= 1 && color.includes('#')) {
    const hexValue = Math.round(opacity * 255).toString(16);
    return `${color.slice(0, 7)}${hexValue.padStart(2, '0').toUpperCase()}`;
  }
  return color;
};

export {colors, getColorOpacity};
