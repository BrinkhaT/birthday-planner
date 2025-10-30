/**
 * Integration Tests: POST /api/birthdays/create
 *
 * Tests the birthday creation API endpoint for success and validation scenarios.
 * Verifies proper UUID generation, date conversion, and German error messages.
 */

import { POST } from '@/app/api/birthdays/create/route';
import { readBirthdays, writeBirthdays } from '@/lib/filestore';
import { EMPTY_STORE, POPULATED_STORE } from '@/__tests__/fixtures/birthdays';
import { createMockRequest } from '@/__tests__/mocks/next-request';

// Mock the filestore module
jest.mock('@/lib/filestore');
// Mock uuid to make tests deterministic
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-12345'),
}));

const mockedReadBirthdays = readBirthdays as jest.MockedFunction<typeof readBirthdays>;
const mockedWriteBirthdays = writeBirthdays as jest.MockedFunction<typeof writeBirthdays>;

describe('POST /api/birthdays/create', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success Cases', () => {
    it('should create birthday with UUID and return 201', async () => {
      // Arrange
      mockedReadBirthdays.mockResolvedValue(EMPTY_STORE);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('POST', {
        name: 'Max Mustermann',
        birthdate: '15.06.1990',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.birthday).toHaveProperty('id');
      expect(data.birthday.id).toBe('test-uuid-12345');
    });

    it('should add birthday to store with German date conversion', async () => {
      // Arrange
      const store = structuredClone(EMPTY_STORE);
      mockedReadBirthdays.mockResolvedValue(store);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('POST', {
        name: 'Paula Müller',
        birthdate: '25.12.2000',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(data.birthday.name).toBe('Paula Müller');
      expect(data.birthday.birthDate).toBe('2000-12-25'); // ISO format
      expect(mockedWriteBirthdays).toHaveBeenCalled();
    });

    it('should handle birthdate without year (DD.MM.)', async () => {
      // Arrange
      mockedReadBirthdays.mockResolvedValue(EMPTY_STORE);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('POST', {
        name: 'Thomas Schmidt',
        birthdate: '15.06.',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.birthday.birthDate).toBe('--06-15'); // ISO recurring format
    });

    it('should trim whitespace from name', async () => {
      // Arrange
      mockedReadBirthdays.mockResolvedValue(EMPTY_STORE);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('POST', {
        name: '  Max Mustermann  ',
        birthdate: '15.06.1990',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(data.birthday.name).toBe('Max Mustermann');
    });

    it('should add createdAt and updatedAt timestamps', async () => {
      // Arrange
      mockedReadBirthdays.mockResolvedValue(EMPTY_STORE);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('POST', {
        name: 'Max Mustermann',
        birthdate: '15.06.1990',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(data.birthday).toHaveProperty('createdAt');
      expect(data.birthday).toHaveProperty('updatedAt');
      expect(data.birthday.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should call writeBirthdays with updated store', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('POST', {
        name: 'New Person',
        birthdate: '01.01.2000',
      });

      // Act
      await POST(request);

      // Assert
      expect(mockedWriteBirthdays).toHaveBeenCalledTimes(1);
      const calledWith = mockedWriteBirthdays.mock.calls[0][0];
      expect(calledWith.birthdays).toHaveLength(4); // 3 existing + 1 new
    });
  });

  describe('Validation Errors - Required Fields', () => {
    it('should return 400 when name is missing', async () => {
      // Arrange
      const request = createMockRequest('POST', {
        birthdate: '15.06.1990',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Name und Geburtsdatum sind erforderlich');
    });

    it('should return 400 when birthdate is missing', async () => {
      // Arrange
      const request = createMockRequest('POST', {
        name: 'Max Mustermann',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Name und Geburtsdatum sind erforderlich');
    });

    it('should return 400 when both fields are missing', async () => {
      // Arrange
      const request = createMockRequest('POST', {});

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Name und Geburtsdatum sind erforderlich');
    });

    it('should return 400 when name is empty string', async () => {
      // Arrange
      const request = createMockRequest('POST', {
        name: '',
        birthdate: '15.06.1990',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Name und Geburtsdatum sind erforderlich');
    });
  });

  describe('Validation Errors - Date Format', () => {
    it('should return 400 for invalid date format (US format)', async () => {
      // Arrange
      const request = createMockRequest('POST', {
        name: 'Max Mustermann',
        birthdate: '06/15/1990', // US format not allowed
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(data.error).toMatch(/Datum|Format/i);
    });

    it('should return 400 for invalid date format (ISO format)', async () => {
      // Arrange
      const request = createMockRequest('POST', {
        name: 'Max Mustermann',
        birthdate: '1990-06-15', // ISO format not allowed in input
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return 400 for invalid day (32.06.1990)', async () => {
      // Arrange
      const request = createMockRequest('POST', {
        name: 'Max Mustermann',
        birthdate: '32.06.1990',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return 400 for invalid month (15.13.1990)', async () => {
      // Arrange
      const request = createMockRequest('POST', {
        name: 'Max Mustermann',
        birthdate: '15.13.1990',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return 400 for February 30th', async () => {
      // Arrange
      const request = createMockRequest('POST', {
        name: 'Max Mustermann',
        birthdate: '30.02.1990',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return 400 for date in future', async () => {
      // Arrange
      const futureYear = new Date().getFullYear() + 1;
      const request = createMockRequest('POST', {
        name: 'Max Mustermann',
        birthdate: `15.06.${futureYear}`,
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toMatch(/Zukunft/i);
    });
  });

  describe('German Error Messages', () => {
    it('should return German error message for missing fields', async () => {
      // Arrange
      const request = createMockRequest('POST', {});

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(data.error).toBe('Name und Geburtsdatum sind erforderlich');
    });

    it('should return German error message for invalid format', async () => {
      // Arrange
      const request = createMockRequest('POST', {
        name: 'Max Mustermann',
        birthdate: 'invalid',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(data.error).toMatch(/Datum|Format/i);
    });
  });

  describe('Error Handling', () => {
    it('should return 500 when filestore read fails', async () => {
      // Arrange
      mockedReadBirthdays.mockRejectedValue(new Error('File read error'));

      const request = createMockRequest('POST', {
        name: 'Max Mustermann',
        birthdate: '15.06.1990',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Fehler beim Erstellen des Geburtstags');
    });

    it('should return 500 when filestore write fails', async () => {
      // Arrange
      mockedReadBirthdays.mockResolvedValue(EMPTY_STORE);
      mockedWriteBirthdays.mockRejectedValue(new Error('File write error'));

      const request = createMockRequest('POST', {
        name: 'Max Mustermann',
        birthdate: '15.06.1990',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Fehler beim Erstellen des Geburtstags');
    });
  });

  describe('Edge Cases', () => {
    it('should handle leap year birthday (29.02.2000)', async () => {
      // Arrange
      mockedReadBirthdays.mockResolvedValue(EMPTY_STORE);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('POST', {
        name: 'Lea Wagner',
        birthdate: '29.02.2000',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.birthday.birthDate).toBe('2000-02-29');
    });

    it('should return 400 when germanDateToISO returns null', async () => {
      // Arrange
      // Mock germanDateToISO by testing with a malformed date that passes regex but fails conversion
      const request = createMockRequest('POST', {
        name: 'Test Person',
        birthdate: '00.00.0000', // Invalid date that might pass initial validation
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should handle names with special characters (ä, ö, ü, ß)', async () => {
      // Arrange
      mockedReadBirthdays.mockResolvedValue(EMPTY_STORE);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('POST', {
        name: 'Müller-Schäfer',
        birthdate: '15.06.1990',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.birthday.name).toBe('Müller-Schäfer');
    });

    it('should handle first day of year (01.01.)', async () => {
      // Arrange
      mockedReadBirthdays.mockResolvedValue(EMPTY_STORE);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('POST', {
        name: 'New Year Baby',
        birthdate: '01.01.',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.birthday.birthDate).toBe('--01-01');
    });

    it('should handle last day of year (31.12.)', async () => {
      // Arrange
      mockedReadBirthdays.mockResolvedValue(EMPTY_STORE);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('POST', {
        name: 'New Years Eve',
        birthdate: '31.12.',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.birthday.birthDate).toBe('--12-31');
    });
  });
});
