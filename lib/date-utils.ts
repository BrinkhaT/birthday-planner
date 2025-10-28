import {
  Birthday,
  BirthdayWithOccurrence,
  ParsedDate,
  BirthdayRanges,
  SplitBirthdays,
} from '@/types/birthday';

// T005: parseBirthDate function
export function parseBirthDate(birthDate: string): ParsedDate {
  const parts = birthDate.split('.');

  return {
    day: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10),
    year: parts[2] ? parseInt(parts[2], 10) : null,
  };
}

// T006: isLeapYear helper function
export function isLeapYear(year: number): boolean {
  // Divisible by 4, except centuries unless divisible by 400
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// T007: getNextOccurrence function with leap year handling
export function getNextOccurrence(
  birthday: Birthday,
  referenceDate: Date
): Date {
  const { day, month } = parseBirthDate(birthday.birthDate);

  // Try to create date in current year
  let nextOccurrence = new Date(
    referenceDate.getFullYear(),
    month - 1,
    day
  );

  // Handle Feb 29 in non-leap years
  if (month === 2 && day === 29 && !isLeapYear(referenceDate.getFullYear())) {
    // Fall back to Feb 28 (specification decision)
    nextOccurrence = new Date(referenceDate.getFullYear(), 1, 28);
  }

  // If birthday already passed this year, use next year
  if (nextOccurrence < referenceDate) {
    nextOccurrence.setFullYear(referenceDate.getFullYear() + 1);

    // Re-check Feb 29 for next year
    if (month === 2 && day === 29 && !isLeapYear(nextOccurrence.getFullYear())) {
      nextOccurrence = new Date(nextOccurrence.getFullYear(), 1, 28);
    }
  }

  return nextOccurrence;
}

// T008: calculateAge function with null handling
export function calculateAge(
  birthday: Birthday,
  referenceDate: Date
): number | null {
  const { day, month, year } = parseBirthDate(birthday.birthDate);

  if (!year) return null; // No birth year available

  // Validate year is not in future (data error)
  if (year > referenceDate.getFullYear()) return null;

  let age = referenceDate.getFullYear() - year;

  // Adjust if birthday hasn't occurred yet this year
  const birthdayThisYear = new Date(
    referenceDate.getFullYear(),
    month - 1,
    day
  );
  if (referenceDate < birthdayThisYear) {
    age -= 1;
  }

  return age;
}

// T009: sortBirthdays function with two-level sort
export function sortBirthdays(
  birthdays: BirthdayWithOccurrence[]
): BirthdayWithOccurrence[] {
  return birthdays.sort((a, b) => {
    // Primary sort: by next occurrence date
    const dateDiff = a.nextOccurrence.getTime() - b.nextOccurrence.getTime();
    if (dateDiff !== 0) return dateDiff;

    // Secondary sort: alphabetically by name
    return a.name.localeCompare(b.name);
  });
}

// T010: splitBirthdays function with date range logic
export function splitBirthdays(
  birthdays: Birthday[],
  referenceDate: Date
): SplitBirthdays {
  // Calculate date ranges
  const upcomingStart = new Date(referenceDate);
  upcomingStart.setHours(0, 0, 0, 0);

  const upcomingEnd = new Date(referenceDate);
  upcomingEnd.setDate(referenceDate.getDate() + 29);
  upcomingEnd.setHours(23, 59, 59, 999);

  const upcoming: BirthdayWithOccurrence[] = [];
  const future: BirthdayWithOccurrence[] = [];

  birthdays.forEach((birthday) => {
    const nextOccurrence = getNextOccurrence(birthday, referenceDate);
    const age = calculateAge(birthday, referenceDate);

    const enriched: BirthdayWithOccurrence = {
      ...birthday,
      nextOccurrence,
      age,
    };

    if (nextOccurrence <= upcomingEnd) {
      upcoming.push(enriched);
    } else {
      future.push(enriched);
    }
  });

  // Sort both arrays by date (ascending), then by name
  return {
    upcoming: sortBirthdays(upcoming),
    future: sortBirthdays(future),
  };
}
