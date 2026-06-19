export const COLORS = {
  primary: '#0A2342',
  primaryLight: '#0D2D57',
  primaryDark: '#061529',
  accent: '#F2C94C',
  accentDark: '#D4A017',

  white: '#FFFFFF',
  gray50: '#F8F9FA',
  gray100: '#F1F3F5',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#6C757D',
  gray700: '#495057',
  gray900: '#1A1A1A',

  success: '#28A745',
  successBg: '#D4EDDA',
  successText: '#155724',
  warning: '#FD7E14',
  warningBg: '#FFF3CD',
  warningText: '#856404',
  danger: '#DC3545',
  dangerBg: '#F8D7DA',
  dangerText: '#721C24',
  info: '#17A2B8',
  infoBg: '#D1ECF1',
} as const;

export const FONT = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
} as const;

export const SPACE = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

export const SHADOW = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export function formatCurrency(amount: number): string {
  const formatted = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `$${formatted}`;
}

export function formatDate(dateStr: string): string {
  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const [, month, day] = dateStr.split('-').map(Number);
  return `${String(day).padStart(2, '0')} ${MESES[month - 1]}`;
}

export function formatDateFull(dateStr: string): string {
  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const [year, month, day] = dateStr.split('-').map(Number);
  return `${String(day).padStart(2, '0')} ${MESES[month - 1]} ${year}`;
}
