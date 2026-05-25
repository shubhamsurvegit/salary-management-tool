export const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'Germany',
  'Canada',
] as const;

export type Country = (typeof COUNTRIES)[number];

export const DEFAULT_COUNTRY: Country = 'India';
