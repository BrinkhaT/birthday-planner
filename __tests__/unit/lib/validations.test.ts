/**
 * Unit tests for lib/validations.ts
 * Tests validation and format conversion for birthday data
 */

import {
  validateBirthdayName,
  validateBirthdayDate,
  germanDateToISO,
  isoToGermanDate,
} from '@/lib/validations';
import { i18nDE } from '@/lib/i18n-de';
import {
  DATE_FORMAT_TEST_CASES,
  NAME_VALIDATION_CASES,
  DATE_VALIDATION_CASES,
} from '../../fixtures/validation-cases';

describe('lib/validations', () => {
  describe('validateBirthdayName', () => {
    // T022: Comprehensive name validation tests

    it('should return null for valid names', () => {
      const validNames = [
        'Paula',
        'Thomas',
        'Isabel',
        'Anna-Maria',
        'José García',
        'Müller',
        'X',
        'Jean-Claude van Damme',
      ];

      validNames.forEach(name => {
        expect(validateBirthdayName(name)).toBeNull();
      });
    });

    it('should reject empty string', () => {
      expect(validateBirthdayName('')).toBe('Name ist erforderlich');
    });

    it('should reject whitespace only', () => {
      expect(validateBirthdayName('   ')).toBe('Name ist erforderlich');
      expect(validateBirthdayName('\t')).toBe('Name ist erforderlich');
      expect(validateBirthdayName('\n')).toBe('Name ist erforderlich');
    });

    it('should accept name with exactly 100 characters', () => {
      const name100 = 'A'.repeat(100);
      expect(validateBirthdayName(name100)).toBeNull();
    });

    it('should reject name with more than 100 characters', () => {
      const name101 = 'A'.repeat(101);
      expect(validateBirthdayName(name101)).toBe(
        'Name darf maximal 100 Zeichen lang sein'
      );
    });

    it('should trim whitespace before validation', () => {
      expect(validateBirthdayName('  Paula  ')).toBeNull();
      expect(validateBirthdayName('  ')).toBe('Name ist erforderlich');
    });

    // Test with fixture data
    describe.each(NAME_VALIDATION_CASES)(
      'fixture case: $description',
      ({ input, expected, description }) => {
        it(`should handle ${description}`, () => {
          expect(validateBirthdayName(input)).toBe(expected);
        });
      }
    );
  });

  describe('validateBirthdayDate', () => {
    // T023: Comprehensive date validation tests

    describe('valid formats', () => {
      it('should accept valid DD.MM.YYYY format', () => {
        expect(validateBirthdayDate('25.12.2000')).toBeNull();
        expect(validateBirthdayDate('01.01.1990')).toBeNull();
        expect(validateBirthdayDate('15.06.1985')).toBeNull();
      });

      it('should accept valid DD.MM. format (with trailing dot)', () => {
        expect(validateBirthdayDate('25.12.')).toBeNull();
        expect(validateBirthdayDate('01.01.')).toBeNull();
      });

      it('should accept valid DD.MM format (without trailing dot)', () => {
        expect(validateBirthdayDate('25.12')).toBeNull();
        expect(validateBirthdayDate('01.01')).toBeNull();
      });

      it('should accept leap year dates', () => {
        expect(validateBirthdayDate('29.02.2000')).toBeNull(); // 2000 is a leap year
        expect(validateBirthdayDate('29.02.2020')).toBeNull(); // 2020 is a leap year
        expect(validateBirthdayDate('29.02.')).toBeNull(); // Without year is always valid
      });
    });

    describe('invalid dates', () => {
      it('should reject invalid day for month', () => {
        expect(validateBirthdayDate('31.02.2000')).toBe('Ungültiges Datum');
        expect(validateBirthdayDate('31.04.2000')).toBe('Ungültiges Datum');
        expect(validateBirthdayDate('31.06.2000')).toBe('Ungültiges Datum');
        expect(validateBirthdayDate('31.09.2000')).toBe('Ungültiges Datum');
        expect(validateBirthdayDate('31.11.2000')).toBe('Ungültiges Datum');
      });

      it('should reject February 29 on non-leap years', () => {
        expect(validateBirthdayDate('29.02.2001')).toBe('Ungültiges Datum');
        expect(validateBirthdayDate('29.02.1900')).toBe('Ungültiges Datum'); // 1900 not a leap year
        expect(validateBirthdayDate('29.02.2100')).toBe('Ungültiges Datum'); // 2100 not a leap year
      });

      it('should reject invalid day values', () => {
        expect(validateBirthdayDate('00.01.2000')).toBe('Ungültiges Datum');
        expect(validateBirthdayDate('32.01.2000')).toBe('Ungültiges Datum');
      });

      it('should reject invalid month values', () => {
        expect(validateBirthdayDate('15.00.2000')).toBe('Ungültiges Datum');
        expect(validateBirthdayDate('15.13.2000')).toBe('Ungültiges Datum');
      });

      it('should reject future dates', () => {
        const futureYear = new Date().getFullYear() + 1;
        expect(validateBirthdayDate(`01.01.${futureYear}`)).toBe(
          'Geburtsdatum kann nicht in der Zukunft liegen'
        );
        expect(validateBirthdayDate('01.01.3000')).toBe(
          'Geburtsdatum kann nicht in der Zukunft liegen'
        );
      });

      it('should reject unrealistic dates (>150 years ago)', () => {
        expect(validateBirthdayDate('01.01.1800')).toBe(
          'Geburtsdatum ist unrealistisch'
        );
        expect(validateBirthdayDate('01.01.1850')).toBe(
          'Geburtsdatum ist unrealistisch'
        );
      });

      it('should reject empty string', () => {
        expect(validateBirthdayDate('')).toBe('Geburtsdatum ist erforderlich');
      });

      it('should reject whitespace only', () => {
        expect(validateBirthdayDate('   ')).toBe(
          'Geburtsdatum ist erforderlich'
        );
      });

      it('should reject invalid format', () => {
        expect(validateBirthdayDate('2000-12-25')).toBe(
          'Ungültiges Datum (Format: TT.MM. oder TT.MM.JJJJ)'
        );
        expect(validateBirthdayDate('25/12/2000')).toBe(
          'Ungültiges Datum (Format: TT.MM. oder TT.MM.JJJJ)'
        );
        expect(validateBirthdayDate('invalid')).toBe(
          'Ungültiges Datum (Format: TT.MM. oder TT.MM.JJJJ)'
        );
        expect(validateBirthdayDate('25.12.00')).toBe(
          'Ungültiges Datum (Format: TT.MM. oder TT.MM.JJJJ)'
        );
      });
    });

    // Test with fixture data
    describe.each(DATE_VALIDATION_CASES)(
      'fixture case: $description',
      ({ input, expected, description }) => {
        it(`should handle ${description}`, () => {
          expect(validateBirthdayDate(input)).toBe(expected);
        });
      }
    );
  });

  describe('germanDateToISO', () => {
    // T024: German to ISO date conversion tests

    describe('full date conversion', () => {
      it('should convert DD.MM.YYYY to YYYY-MM-DD', () => {
        expect(germanDateToISO('25.12.2000')).toBe('2000-12-25');
        expect(germanDateToISO('01.01.1990')).toBe('1990-01-01');
        expect(germanDateToISO('15.06.1985')).toBe('1985-06-15');
        expect(germanDateToISO('29.02.2000')).toBe('2000-02-29');
      });
    });

    describe('short date conversion', () => {
      it('should convert DD.MM. to --MM-DD (with trailing dot)', () => {
        expect(germanDateToISO('25.12.')).toBe('--12-25');
        expect(germanDateToISO('01.01.')).toBe('--01-01');
        expect(germanDateToISO('15.06.')).toBe('--06-15');
      });

      it('should convert DD.MM to --MM-DD (without trailing dot)', () => {
        expect(germanDateToISO('25.12')).toBe('--12-25');
        expect(germanDateToISO('01.01')).toBe('--01-01');
        expect(germanDateToISO('15.06')).toBe('--06-15');
      });
    });

    describe('invalid formats', () => {
      it('should return null for invalid format', () => {
        expect(germanDateToISO('2000-12-25')).toBeNull();
        expect(germanDateToISO('25/12/2000')).toBeNull();
        expect(germanDateToISO('invalid')).toBeNull();
        expect(germanDateToISO('')).toBeNull();
        expect(germanDateToISO('25.12.00')).toBeNull(); // Year must be 4 digits
        expect(germanDateToISO('25.12.20000')).toBeNull(); // Year must be exactly 4 digits
      });
    });

    // Test with fixture data (valid formats only)
    describe('fixture cases', () => {
      DATE_FORMAT_TEST_CASES.filter(tc => tc.iso !== null).forEach(
        ({ german, iso, description }) => {
          it(`should convert ${description}: ${german} -> ${iso}`, () => {
            expect(germanDateToISO(german)).toBe(iso);
          });
        }
      );
    });
  });

  describe('isoToGermanDate', () => {
    // T025: ISO to German date conversion tests

    describe('full date conversion', () => {
      it('should convert YYYY-MM-DD to DD.MM.YYYY', () => {
        expect(isoToGermanDate('2000-12-25')).toBe('25.12.2000');
        expect(isoToGermanDate('1990-01-01')).toBe('01.01.1990');
        expect(isoToGermanDate('1985-06-15')).toBe('15.06.1985');
        expect(isoToGermanDate('2000-02-29')).toBe('29.02.2000');
      });
    });

    describe('short date conversion', () => {
      it('should convert --MM-DD to DD.MM. (with trailing dot)', () => {
        expect(isoToGermanDate('--12-25')).toBe('25.12.');
        expect(isoToGermanDate('--01-01')).toBe('01.01.');
        expect(isoToGermanDate('--06-15')).toBe('15.06.');
      });
    });

    describe('invalid formats', () => {
      it('should return null for invalid format', () => {
        expect(isoToGermanDate('25.12.2000')).toBeNull();
        expect(isoToGermanDate('2000/12/25')).toBeNull();
        expect(isoToGermanDate('invalid')).toBeNull();
        expect(isoToGermanDate('')).toBeNull();
        expect(isoToGermanDate('2000-1-1')).toBeNull(); // Month/day must be 2 digits
        expect(isoToGermanDate('00-12-25')).toBeNull(); // Year must be 4 digits
      });
    });

    // Test with fixture data (valid formats only)
    describe('fixture cases', () => {
      DATE_FORMAT_TEST_CASES.filter(tc => tc.iso !== null).forEach(
        ({ german, iso, description }) => {
          it(`should convert ${description}: ${iso} -> German format`, () => {
            const result = isoToGermanDate(iso!);
            // Normalize: short dates should have trailing dot
            const expectedGerman = german.match(/^\d{2}\.\d{2}$/)
              ? `${german}.`
              : german;
            expect(result).toBe(expectedGerman);
          });
        }
      );
    });
  });

  describe('format round-trip conversion', () => {
    // T026: Comprehensive round-trip tests

    it('should round-trip German -> ISO -> German for full dates', () => {
      const testDates = [
        '25.12.2000',
        '01.01.1990',
        '15.06.1985',
        '29.02.2000',
        '31.12.1999',
      ];

      testDates.forEach(germanDate => {
        const iso = germanDateToISO(germanDate);
        expect(iso).not.toBeNull();
        const backToGerman = isoToGermanDate(iso!);
        expect(backToGerman).toBe(germanDate);
      });
    });

    it('should round-trip German -> ISO -> German for short dates', () => {
      const testDates = [
        '25.12.',
        '01.01.',
        '15.06.',
        '31.12.',
        '29.02.',
      ];

      testDates.forEach(germanDate => {
        const iso = germanDateToISO(germanDate);
        expect(iso).not.toBeNull();
        const backToGerman = isoToGermanDate(iso!);
        expect(backToGerman).toBe(germanDate);
      });
    });

    it('should handle short dates without trailing dot in round-trip', () => {
      const testDates = ['25.12', '01.01', '15.06'];

      testDates.forEach(germanDateNoDot => {
        const iso = germanDateToISO(germanDateNoDot);
        expect(iso).not.toBeNull();
        const backToGerman = isoToGermanDate(iso!);
        // Should add trailing dot
        expect(backToGerman).toBe(`${germanDateNoDot}.`);
      });
    });

    it('should round-trip ISO -> German -> ISO for full dates', () => {
      const testDates = [
        '2000-12-25',
        '1990-01-01',
        '1985-06-15',
        '2000-02-29',
        '1999-12-31',
      ];

      testDates.forEach(isoDate => {
        const german = isoToGermanDate(isoDate);
        expect(german).not.toBeNull();
        const backToISO = germanDateToISO(german!);
        expect(backToISO).toBe(isoDate);
      });
    });

    it('should round-trip ISO -> German -> ISO for short dates', () => {
      const testDates = ['--12-25', '--01-01', '--06-15', '--12-31', '--02-29'];

      testDates.forEach(isoDate => {
        const german = isoToGermanDate(isoDate);
        expect(german).not.toBeNull();
        const backToISO = germanDateToISO(german!);
        expect(backToISO).toBe(isoDate);
      });
    });

    // Test with all valid fixture cases
    describe('fixture round-trip tests', () => {
      DATE_FORMAT_TEST_CASES.filter(tc => tc.iso !== null).forEach(
        ({ german, iso, description }) => {
          it(`should round-trip ${description}`, () => {
            // German -> ISO
            const convertedISO = germanDateToISO(german);
            expect(convertedISO).toBe(iso);

            // ISO -> German
            const convertedGerman = isoToGermanDate(iso!);
            // Normalize: short dates without trailing dot should have dot added
            const expectedGerman = german.match(/^\d{2}\.\d{2}$/)
              ? `${german}.`
              : german;
            expect(convertedGerman).toBe(expectedGerman);
          });
        }
      );
    });
  });

  describe('German error message validation', () => {
    // T027: Verify error messages match i18n-de.ts

    it('should use correct German error message for required name', () => {
      const error = validateBirthdayName('');
      expect(error).toBe(i18nDE.validation.nameRequired);
    });

    it('should use correct German error message for max length name', () => {
      const error = validateBirthdayName('A'.repeat(101));
      expect(error).toBe(i18nDE.validation.nameMaxLength);
    });

    it('should use correct German error message for required date', () => {
      const error = validateBirthdayDate('');
      expect(error).toBe(i18nDE.validation.birthdateRequired);
    });

    it('should use correct German error message for invalid date', () => {
      const error = validateBirthdayDate('31.02.2000');
      expect(error).toBe(i18nDE.validation.birthdateInvalid);
    });

    it('should use correct German error message for future date', () => {
      const error = validateBirthdayDate('01.01.3000');
      expect(error).toBe(i18nDE.validation.birthdateFuture);
    });

    it('should use correct German error message for unrealistic date', () => {
      const error = validateBirthdayDate('01.01.1800');
      expect(error).toBe(i18nDE.validation.birthdateUnrealistic);
    });

    it('should use German format hint in error message', () => {
      const error = validateBirthdayDate('invalid');
      expect(error).toContain('TT.MM.');
      expect(error).toContain('TT.MM.JJJJ');
    });
  });
});
