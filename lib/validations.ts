/**
 * Validation utilities for birthday data
 */

/**
 * Validates a birthday name
 * @param name - The name to validate
 * @returns Error message in German or null if valid
 */
export function validateBirthdayName(name: string): string | null {
  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return "Name ist erforderlich";
  }

  if (trimmedName.length > 100) {
    return "Name darf maximal 100 Zeichen lang sein";
  }

  return null;
}

/**
 * Validates a birthday date
 * @param birthdate - The birthdate string in DD.MM.YYYY, DD.MM, or DD.MM. format
 * @returns Error message in German or null if valid
 */
export function validateBirthdayDate(birthdate: string): string | null {
  if (!birthdate || birthdate.trim().length === 0) {
    return "Geburtsdatum ist erforderlich";
  }

  // Check DD.MM.YYYY, DD.MM, or DD.MM. format (optional trailing dot)
  const fullDatePattern = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  const shortDatePattern = /^(\d{2})\.(\d{2})\.?$/;

  const fullMatch = birthdate.match(fullDatePattern);
  const shortMatch = birthdate.match(shortDatePattern);

  if (!fullMatch && !shortMatch) {
    return "Ungültiges Datum (Format: TT.MM. oder TT.MM.JJJJ)";
  }

  const day = parseInt((fullMatch || shortMatch)![1], 10);
  const month = parseInt((fullMatch || shortMatch)![2], 10);
  const year = fullMatch ? parseInt(fullMatch[3], 10) : 2000; // Use 2000 as reference year for validation

  // Create Date object to validate day/month combination
  const date = new Date(year, month - 1, day);

  // Check if date is valid (day and month must be valid)
  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1
  ) {
    return "Ungültiges Datum";
  }

  // Only validate year constraints if year was provided
  if (fullMatch) {
    const actualYear = parseInt(fullMatch[3], 10);

    // Check if date is in the future
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const fullDate = new Date(actualYear, month - 1, day);

    if (fullDate > now) {
      return "Geburtsdatum kann nicht in der Zukunft liegen";
    }

    // Check if age would be over 150 years (unrealistic)
    const ageInYears = (now.getTime() - fullDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

    if (ageInYears > 150) {
      return "Geburtsdatum ist unrealistisch";
    }
  }

  return null;
}

/**
 * Converts DD.MM.YYYY, DD.MM, or DD.MM. format to ISO date string
 * @param germanDate - Date in DD.MM.YYYY, DD.MM, or DD.MM. format
 * @returns ISO date string (YYYY-MM-DD or --MM-DD for dates without year) or null if invalid
 */
export function germanDateToISO(germanDate: string): string | null {
  const fullDatePattern = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  const shortDatePattern = /^(\d{2})\.(\d{2})\.?$/; // Optional trailing dot

  const fullMatch = germanDate.match(fullDatePattern);
  const shortMatch = germanDate.match(shortDatePattern);

  if (fullMatch) {
    // Full date with year: DD.MM.YYYY -> YYYY-MM-DD
    const day = fullMatch[1];
    const month = fullMatch[2];
    const year = fullMatch[3];
    return `${year}-${month}-${day}`;
  } else if (shortMatch) {
    // Date without year: DD.MM -> --MM-DD (ISO 8601 recurring date format)
    const day = shortMatch[1];
    const month = shortMatch[2];
    return `--${month}-${day}`;
  }

  return null;
}

/**
 * Converts ISO date string to German format
 * @param isoDate - ISO date string (YYYY-MM-DD or --MM-DD)
 * @returns Date in DD.MM.YYYY or DD.MM. format or null if invalid
 */
export function isoToGermanDate(isoDate: string): string | null {
  const fullDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
  const shortDatePattern = /^--(\d{2})-(\d{2})$/;

  const fullMatch = isoDate.match(fullDatePattern);
  const shortMatch = isoDate.match(shortDatePattern);

  if (fullMatch) {
    // Full date: YYYY-MM-DD -> DD.MM.YYYY
    const year = fullMatch[1];
    const month = fullMatch[2];
    const day = fullMatch[3];
    return `${day}.${month}.${year}`;
  } else if (shortMatch) {
    // Date without year: --MM-DD -> DD.MM. (with trailing dot)
    const month = shortMatch[1];
    const day = shortMatch[2];
    return `${day}.${month}.`;
  }

  return null;
}
