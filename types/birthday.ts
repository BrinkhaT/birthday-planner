export interface Birthday {
  id: string;
  name: string;
  birthDate: string; // Format: DD.MM (no year) or DD.MM.YYYY (4-digit year)
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
}

export interface BirthdayStore {
  version: string;
  birthdays: Birthday[];
}

export interface BirthdayValidationError {
  field: string;
  message: string;
  value: any;
}

// T001: BirthdayWithOccurrence type extending Birthday
export interface BirthdayWithOccurrence extends Birthday {
  nextOccurrence: Date;    // Next occurrence relative to reference date
  age: number | null;      // Calculated age, null if birth year unavailable
}

// T002: ParsedDate interface
export interface ParsedDate {
  day: number;
  month: number;
  year: number | null;
}

// T003: DateRange and BirthdayRanges interfaces
export interface DateRange {
  start: Date;             // Inclusive start
  end: Date;               // Inclusive end
}

export interface BirthdayRanges {
  upcoming: DateRange;     // Next 30 days (today through today + 29 days)
  future: DateRange;       // Remaining annual cycle (today + 30 days through yesterday + 1 year)
}

// T004: SplitBirthdays interface
export interface SplitBirthdays {
  upcoming: BirthdayWithOccurrence[];    // Section 1: Next 30 days
  future: BirthdayWithOccurrence[];      // Section 2: Remaining year
}
