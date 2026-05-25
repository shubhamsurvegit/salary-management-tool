export const DEFAULT_CURRENCY = 'INR';

export function formatSalary(amount: number, currency = DEFAULT_CURRENCY): string {
  return `${currency} ${amount.toLocaleString()}`;
}
