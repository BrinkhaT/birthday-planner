import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBirthDate(dateString: string): string {
  // Format: MM.DD.YY -> Display format
  return dateString;
}

export function validateBirthDate(dateString: string): boolean {
  const regex = /^\d{2}\.\d{2}\.\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const [month, day, year] = dateString.split('.').map(Number);

  if (month < 1 || month > 12) {
    return false;
  }

  if (day < 1 || day > 31) {
    return false;
  }

  return true;
}
