// German Date Format Test Cases
export const DATE_FORMAT_TEST_CASES = [
  // Valid formats
  { german: '25.12.2000', iso: '2000-12-25', description: 'Full date with year' },
  { german: '15.06.', iso: '--06-15', description: 'Date without year (with trailing dot)' },
  { german: '15.06', iso: '--06-15', description: 'Date without year (without trailing dot)' },
  { german: '01.01.1900', iso: '1900-01-01', description: 'Historical date' },
  { german: '29.02.2000', iso: '2000-02-29', description: 'Leap year date' },

  // Invalid formats
  { german: '31.02.2000', iso: null, error: 'Ungültiges Datum', description: 'Invalid day for month' },
  { german: '32.01.2000', iso: null, error: 'Ungültiges Datum', description: 'Day out of range' },
  { german: '15.13.2000', iso: null, error: 'Ungültiges Datum', description: 'Month out of range' },
  { german: '00.01.2000', iso: null, error: 'Ungültiges Datum', description: 'Zero day' },
  { german: '15.00.2000', iso: null, error: 'Ungültiges Datum', description: 'Zero month' },
  { german: '', iso: null, error: 'Geburtsdatum ist erforderlich', description: 'Empty string' },
  { german: 'invalid', iso: null, error: 'Ungültiges Datum (Format: TT.MM. oder TT.MM.JJJJ)', description: 'Non-date string' },
];

// Name Validation Test Cases
export const NAME_VALIDATION_CASES = [
  { input: 'Paula', expected: null, description: 'Valid short name' },
  { input: 'Anna-Maria Müller', expected: null, description: 'Valid name with hyphen and umlaut' },
  { input: 'José García', expected: null, description: 'Valid name with accents' },
  { input: 'X', expected: null, description: 'Valid single character' },
  { input: 'A'.repeat(100), expected: null, description: 'Valid 100 characters (boundary)' },
  { input: '', expected: 'Name ist erforderlich', description: 'Empty string' },
  { input: '   ', expected: 'Name ist erforderlich', description: 'Whitespace only' },
  { input: 'A'.repeat(101), expected: 'Name darf maximal 100 Zeichen lang sein', description: 'Exceeds 100 characters' },
];

// Date Validation Test Cases
export const DATE_VALIDATION_CASES = [
  { input: '25.12.2000', expected: null, description: 'Valid full date' },
  { input: '15.06.', expected: null, description: 'Valid date without year' },
  { input: '29.02.2000', expected: null, description: 'Valid leap year date' },
  { input: '31.02.2000', expected: 'Ungültiges Datum', description: 'Invalid day for February' },
  { input: '01.01.3000', expected: 'Geburtsdatum kann nicht in der Zukunft liegen', description: 'Future date' },
  { input: '01.01.1800', expected: 'Geburtsdatum ist unrealistisch', description: 'Unrealistic past date (>150 years)' },
  { input: '', expected: 'Geburtsdatum ist erforderlich', description: 'Empty string' },
];
