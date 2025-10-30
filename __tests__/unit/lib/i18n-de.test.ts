/**
 * Optional tests for i18n-de.ts German localization strings
 *
 * Purpose: Validate structure, check for missing translations, ensure consistency
 */

import { i18nDE } from '@/lib/i18n-de';

describe('i18n-de', () => {
  describe('Structure Validation', () => {
    it('has all required top-level keys', () => {
      expect(i18nDE).toHaveProperty('modal');
      expect(i18nDE).toHaveProperty('form');
      expect(i18nDE).toHaveProperty('buttons');
      expect(i18nDE).toHaveProperty('tooltips');
      expect(i18nDE).toHaveProperty('validation');
      expect(i18nDE).toHaveProperty('confirmation');
      expect(i18nDE).toHaveProperty('success');
      expect(i18nDE).toHaveProperty('error');
      expect(i18nDE).toHaveProperty('loading');
    });

    it('has modal translations', () => {
      expect(i18nDE.modal).toHaveProperty('addTitle');
      expect(i18nDE.modal).toHaveProperty('editTitle');
      expect(i18nDE.modal).toHaveProperty('deleteTitle');
    });

    it('has form translations', () => {
      expect(i18nDE.form).toHaveProperty('nameLabel');
      expect(i18nDE.form).toHaveProperty('namePlaceholder');
      expect(i18nDE.form).toHaveProperty('birthdateLabel');
      expect(i18nDE.form).toHaveProperty('birthdatePlaceholder');
    });

    it('has button translations', () => {
      expect(i18nDE.buttons).toHaveProperty('save');
      expect(i18nDE.buttons).toHaveProperty('cancel');
      expect(i18nDE.buttons).toHaveProperty('delete');
      expect(i18nDE.buttons).toHaveProperty('add');
      expect(i18nDE.buttons).toHaveProperty('edit');
      expect(i18nDE.buttons).toHaveProperty('confirm');
    });

    it('has validation translations', () => {
      expect(i18nDE.validation).toHaveProperty('nameRequired');
      expect(i18nDE.validation).toHaveProperty('nameMaxLength');
      expect(i18nDE.validation).toHaveProperty('birthdateRequired');
      expect(i18nDE.validation).toHaveProperty('birthdateInvalid');
      expect(i18nDE.validation).toHaveProperty('birthdateFuture');
      expect(i18nDE.validation).toHaveProperty('birthdateUnrealistic');
    });
  });

  describe('Content Validation', () => {
    it('has non-empty strings for all modal titles', () => {
      expect(i18nDE.modal.addTitle).toBeTruthy();
      expect(i18nDE.modal.editTitle).toBeTruthy();
      expect(i18nDE.modal.deleteTitle).toBeTruthy();
      expect(typeof i18nDE.modal.addTitle).toBe('string');
      expect(typeof i18nDE.modal.editTitle).toBe('string');
      expect(typeof i18nDE.modal.deleteTitle).toBe('string');
    });

    it('has non-empty strings for all form labels', () => {
      expect(i18nDE.form.nameLabel).toBeTruthy();
      expect(i18nDE.form.namePlaceholder).toBeTruthy();
      expect(i18nDE.form.birthdateLabel).toBeTruthy();
      expect(i18nDE.form.birthdatePlaceholder).toBeTruthy();
    });

    it('has non-empty strings for all buttons', () => {
      expect(i18nDE.buttons.save).toBeTruthy();
      expect(i18nDE.buttons.cancel).toBeTruthy();
      expect(i18nDE.buttons.delete).toBeTruthy();
      expect(i18nDE.buttons.add).toBeTruthy();
      expect(i18nDE.buttons.edit).toBeTruthy();
      expect(i18nDE.buttons.confirm).toBeTruthy();
    });

    it('has non-empty strings for all validation messages', () => {
      expect(i18nDE.validation.nameRequired).toBeTruthy();
      expect(i18nDE.validation.nameMaxLength).toBeTruthy();
      expect(i18nDE.validation.birthdateRequired).toBeTruthy();
      expect(i18nDE.validation.birthdateInvalid).toBeTruthy();
      expect(i18nDE.validation.birthdateFuture).toBeTruthy();
      expect(i18nDE.validation.birthdateUnrealistic).toBeTruthy();
    });

    it('has non-empty strings for all error messages', () => {
      expect(i18nDE.error.saveFailed).toBeTruthy();
      expect(i18nDE.error.deleteFailed).toBeTruthy();
      expect(i18nDE.error.loadFailed).toBeTruthy();
      expect(i18nDE.error.notFound).toBeTruthy();
      expect(i18nDE.error.generic).toBeTruthy();
    });
  });

  describe('German Language Validation', () => {
    it('uses German text for modal titles', () => {
      expect(i18nDE.modal.addTitle).toBe('Geburtstag hinzufügen');
      expect(i18nDE.modal.editTitle).toBe('Geburtstag bearbeiten');
      expect(i18nDE.modal.deleteTitle).toBe('Geburtstag löschen?');
    });

    it('uses German text for form labels', () => {
      expect(i18nDE.form.nameLabel).toBe('Name');
      expect(i18nDE.form.birthdateLabel).toBe('Geburtsdatum');
    });

    it('uses German text for buttons', () => {
      expect(i18nDE.buttons.save).toBe('Speichern');
      expect(i18nDE.buttons.cancel).toBe('Abbrechen');
      expect(i18nDE.buttons.delete).toBe('Löschen');
    });

    it('uses German text for validation errors', () => {
      expect(i18nDE.validation.nameRequired).toBe('Name ist erforderlich');
      expect(i18nDE.validation.birthdateRequired).toBe('Geburtsdatum ist erforderlich');
      expect(i18nDE.validation.birthdateInvalid).toBe('Ungültiges Datum');
      expect(i18nDE.validation.birthdateFuture).toBe(
        'Geburtsdatum kann nicht in der Zukunft liegen'
      );
    });
  });

  describe('Function Properties', () => {
    it('has deleteName function that returns formatted string', () => {
      expect(typeof i18nDE.confirmation.deleteName).toBe('function');
      expect(i18nDE.confirmation.deleteName('Paula')).toBe('Geburtstag von Paula löschen');
      expect(i18nDE.confirmation.deleteName('Thomas')).toBe('Geburtstag von Thomas löschen');
    });

    it('deleteName handles empty string', () => {
      expect(i18nDE.confirmation.deleteName('')).toBe('Geburtstag von  löschen');
    });

    it('deleteName handles special characters', () => {
      expect(i18nDE.confirmation.deleteName('Müller')).toBe('Geburtstag von Müller löschen');
      expect(i18nDE.confirmation.deleteName('José García')).toBe(
        'Geburtstag von José García löschen'
      );
    });
  });

  describe('Consistency Checks', () => {
    it('has consistent naming patterns (no missing translations)', () => {
      // All keys should have values (no undefined)
      const getAllValues = (obj: any): any[] => {
        return Object.entries(obj).flatMap(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            return getAllValues(value);
          }
          return value;
        });
      };

      const allValues = getAllValues(i18nDE);
      const undefinedValues = allValues.filter(v => v === undefined);
      expect(undefinedValues).toHaveLength(0);
    });

    it('has no empty strings (all translations filled)', () => {
      const getAllStrings = (obj: any): string[] => {
        return Object.entries(obj).flatMap(([key, value]) => {
          if (typeof value === 'object' && value !== null && typeof value !== 'function') {
            return getAllStrings(value);
          }
          if (typeof value === 'string') {
            return value;
          }
          return [];
        });
      };

      const allStrings = getAllStrings(i18nDE);
      const emptyStrings = allStrings.filter(s => s === '');
      expect(emptyStrings).toHaveLength(0);
    });

    it('uses consistent formatting for validation messages', () => {
      // Validation messages should start with capital letter
      expect(i18nDE.validation.nameRequired[0]).toBe(
        i18nDE.validation.nameRequired[0].toUpperCase()
      );
      expect(i18nDE.validation.birthdateRequired[0]).toBe(
        i18nDE.validation.birthdateRequired[0].toUpperCase()
      );
      expect(i18nDE.validation.birthdateInvalid[0]).toBe(
        i18nDE.validation.birthdateInvalid[0].toUpperCase()
      );
    });

    it('uses consistent formatting for error messages', () => {
      // Error messages should start with capital letter
      expect(i18nDE.error.saveFailed[0]).toBe(
        i18nDE.error.saveFailed[0].toUpperCase()
      );
      expect(i18nDE.error.deleteFailed[0]).toBe(
        i18nDE.error.deleteFailed[0].toUpperCase()
      );
      expect(i18nDE.error.loadFailed[0]).toBe(
        i18nDE.error.loadFailed[0].toUpperCase()
      );
    });
  });

  describe('Placeholder Format Validation', () => {
    it('has correct date format in placeholder', () => {
      expect(i18nDE.form.birthdatePlaceholder).toContain('TT.MM');
      expect(i18nDE.form.birthdatePlaceholder).toContain('JJJJ');
    });

    it('placeholder matches expected German date format', () => {
      expect(i18nDE.form.birthdatePlaceholder).toBe('TT.MM. oder TT.MM.JJJJ');
    });
  });

  describe('Type Safety', () => {
    it('exports as const for type safety', () => {
      // TypeScript should infer literal types for all strings
      // This test verifies the structure is accessible
      const modalTitle: string = i18nDE.modal.addTitle;
      const validation: string = i18nDE.validation.nameRequired;
      expect(modalTitle).toBeDefined();
      expect(validation).toBeDefined();
    });
  });

  describe('Usage Examples', () => {
    it('can be used in validation functions', () => {
      const name = '';
      const error = name.trim() === '' ? i18nDE.validation.nameRequired : null;
      expect(error).toBe('Name ist erforderlich');
    });

    it('can be used in button labels', () => {
      const buttonLabel = i18nDE.buttons.save;
      expect(buttonLabel).toBe('Speichern');
    });

    it('can be used in dynamic messages', () => {
      const name = 'Paula';
      const message = i18nDE.confirmation.deleteName(name);
      expect(message).toBe('Geburtstag von Paula löschen');
    });
  });
});
