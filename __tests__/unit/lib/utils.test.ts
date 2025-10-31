import { cn, formatBirthDate, validateBirthDate } from '@/lib/utils';

describe('lib/utils', () => {
  describe('cn (className merger)', () => {
    it('should merge single class name', () => {
      const result = cn('text-red-500');

      expect(result).toBe('text-red-500');
    });

    it('should merge multiple class names', () => {
      const result = cn('text-red-500', 'bg-blue-200', 'p-4');

      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-200');
      expect(result).toContain('p-4');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');

      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
    });

    it('should filter out false/null/undefined values', () => {
      const result = cn('base-class', false && 'hidden', null, undefined, 'visible');

      expect(result).toContain('base-class');
      expect(result).toContain('visible');
      expect(result).not.toContain('hidden');
    });

    it('should merge Tailwind CSS conflicting classes correctly', () => {
      // twMerge should handle conflicting Tailwind classes
      const result = cn('p-4', 'p-8');

      // Should only contain p-8 (later class wins)
      expect(result).toBe('p-8');
    });

    it('should handle empty input', () => {
      const result = cn();

      expect(result).toBe('');
    });

    it('should handle array of classes', () => {
      const result = cn(['text-red-500', 'bg-blue-200']);

      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-200');
    });

    it('should handle object with boolean values', () => {
      const result = cn({
        'text-red-500': true,
        'bg-blue-200': false,
        'p-4': true,
      });

      expect(result).toContain('text-red-500');
      expect(result).not.toContain('bg-blue-200');
      expect(result).toContain('p-4');
    });
  });

  describe('formatBirthDate', () => {
    it('should convert ISO format with year to German format', () => {
      const result = formatBirthDate('2000-12-25');

      expect(result).toBe('25.12.2000');
    });

    it('should convert ISO format without year to German format', () => {
      const result = formatBirthDate('--06-15');

      expect(result).toBe('15.06.');
    });

    it('should handle leap year date', () => {
      const result = formatBirthDate('2000-02-29');

      expect(result).toBe('29.02.2000');
    });

    it('should handle January dates', () => {
      const result = formatBirthDate('1990-01-01');

      expect(result).toBe('01.01.1990');
    });

    it('should handle December dates', () => {
      const result = formatBirthDate('1995-12-31');

      expect(result).toBe('31.12.1995');
    });

    it('should return original string for invalid format', () => {
      const invalidDate = 'invalid-date';
      const result = formatBirthDate(invalidDate);

      // When isoToGermanDate returns null, formatBirthDate returns original
      expect(result).toBe(invalidDate);
    });

    it('should handle already formatted German date (pass-through)', () => {
      const germanDate = '25.12.2000';
      const result = formatBirthDate(germanDate);

      // Will return original if conversion fails
      expect(result).toBe(germanDate);
    });
  });

  describe('validateBirthDate', () => {
    describe('Valid dates', () => {
      it('should validate date with year (DD.MM.YYYY)', () => {
        expect(validateBirthDate('25.12.2000')).toBe(true);
        expect(validateBirthDate('01.01.1990')).toBe(true);
        expect(validateBirthDate('31.12.2100')).toBe(true);
      });

      it('should validate date without year (DD.MM)', () => {
        // Note: The function accepts DD.MM (without trailing dot)
        expect(validateBirthDate('15.06')).toBe(true);
        expect(validateBirthDate('01.01')).toBe(true);
        expect(validateBirthDate('31.12')).toBe(true);
      });

      it('should validate leap year date', () => {
        expect(validateBirthDate('29.02.2000')).toBe(true);
        expect(validateBirthDate('29.02.2024')).toBe(true);
      });

      it('should validate dates with leading zeros', () => {
        expect(validateBirthDate('01.01.2000')).toBe(true);
        expect(validateBirthDate('05.08.1995')).toBe(true);
      });

      it('should validate boundary dates', () => {
        expect(validateBirthDate('01.01.1900')).toBe(true); // Min year
        expect(validateBirthDate('31.12.2100')).toBe(true); // Max year
        expect(validateBirthDate('31.12')).toBe(true);      // Max day/month without year
      });
    });

    describe('Invalid dates', () => {
      it('should reject invalid format', () => {
        expect(validateBirthDate('2000-12-25')).toBe(false);  // ISO format
        expect(validateBirthDate('25/12/2000')).toBe(false);  // Slash separator
        expect(validateBirthDate('25-12-2000')).toBe(false);  // Dash separator
        expect(validateBirthDate('25.12.')).toBe(false);      // Has trailing dot (not accepted)
        expect(validateBirthDate('25122000')).toBe(false);    // No separators
      });

      it('should reject invalid day values', () => {
        expect(validateBirthDate('00.12.2000')).toBe(false);  // Day = 0
        expect(validateBirthDate('32.12.2000')).toBe(false);  // Day > 31
        expect(validateBirthDate('99.12.2000')).toBe(false);  // Day too large
      });

      it('should reject invalid month values', () => {
        expect(validateBirthDate('25.00.2000')).toBe(false);  // Month = 0
        expect(validateBirthDate('25.13.2000')).toBe(false);  // Month > 12
        expect(validateBirthDate('25.99.2000')).toBe(false);  // Month too large
      });

      it('should reject invalid year values', () => {
        expect(validateBirthDate('25.12.1899')).toBe(false);  // Year < 1900
        expect(validateBirthDate('25.12.2101')).toBe(false);  // Year > 2100
        expect(validateBirthDate('25.12.999')).toBe(false);   // 3-digit year
        expect(validateBirthDate('25.12.10000')).toBe(false); // 5-digit year
      });

      it('should reject empty or malformed strings', () => {
        expect(validateBirthDate('')).toBe(false);
        expect(validateBirthDate('.')).toBe(false);
        expect(validateBirthDate('..')).toBe(false);
        expect(validateBirthDate('...')).toBe(false);
      });

      it('should reject non-numeric values', () => {
        expect(validateBirthDate('XX.12.2000')).toBe(false);
        expect(validateBirthDate('25.XX.2000')).toBe(false);
        expect(validateBirthDate('25.12.XXXX')).toBe(false);
      });

      it('should reject dates with wrong number of digits', () => {
        expect(validateBirthDate('5.12.2000')).toBe(false);   // Single digit day
        expect(validateBirthDate('25.2.2000')).toBe(false);   // Single digit month
        expect(validateBirthDate('25.12.20')).toBe(false);    // 2-digit year
        expect(validateBirthDate('025.12.2000')).toBe(false); // 3-digit day
      });
    });

    describe('Edge cases', () => {
      it('should validate all months', () => {
        for (let month = 1; month <= 12; month++) {
          const monthStr = month.toString().padStart(2, '0');
          expect(validateBirthDate(`15.${monthStr}.2000`)).toBe(true);
        }
      });

      it('should validate 31-day months', () => {
        const months31Days = ['01', '03', '05', '07', '08', '10', '12'];
        months31Days.forEach(month => {
          expect(validateBirthDate(`31.${month}.2000`)).toBe(true);
        });
      });

      it('should validate 30-day months', () => {
        const months30Days = ['04', '06', '09', '11'];
        months30Days.forEach(month => {
          expect(validateBirthDate(`30.${month}.2000`)).toBe(true);
        });
      });

      it('should handle whitespace (should fail)', () => {
        expect(validateBirthDate(' 25.12.2000')).toBe(false);
        expect(validateBirthDate('25.12.2000 ')).toBe(false);
        expect(validateBirthDate('25. 12.2000')).toBe(false);
      });
    });
  });
});
