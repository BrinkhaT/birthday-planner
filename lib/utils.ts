import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBirthDate(dateString: string): string {
  // Format: DD.MM or DD.MM.YYYY -> Display format
  return dateString;
}

export function validateBirthDate(dateString: string): boolean {
  // Accept DD.MM (no year) or DD.MM.YYYY (4-digit year) - German format
  const regex = /^\d{2}\.\d{2}(?:\.\d{4})?$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const parts = dateString.split('.');
  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = parts[2] ? Number(parts[2]) : null;

  if (day < 1 || day > 31) {
    return false;
  }

  if (month < 1 || month > 12) {
    return false;
  }

  // If year is provided, validate it's a reasonable 4-digit year
  if (year !== null && (year < 1900 || year > 2100)) {
    return false;
  }

  return true;
}
