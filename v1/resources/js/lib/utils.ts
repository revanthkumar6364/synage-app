import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format a number with comma separators and proper decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @param currency - Currency symbol to prepend (default: '')
 * @returns Formatted string with commas and currency symbol
 */
export function formatNumber(value: number | string | null | undefined, decimals: number = 2, currency: string = ''): string {
  if (value === null || value === undefined || value === '') {
    return currency + '0.00';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return currency + '0.00';
  }

  return currency + numValue.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format currency values with ₹ symbol and comma separators
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number | string | null | undefined, decimals: number = 2): string {
  return formatNumber(value, decimals, '₹');
}
