/**
 * Integration Tests: PUT/DELETE /api/birthdays/[id]
 *
 * Tests the birthday update and delete API endpoints.
 * Verifies proper validation, UUID preservation, and German error messages.
 */

import { PUT, DELETE } from '@/app/api/birthdays/[id]/route';
import { readBirthdays, writeBirthdays } from '@/lib/filestore';
import { BIRTHDAY_WITH_YEAR, POPULATED_STORE } from '@/__tests__/fixtures/birthdays';
import { createMockRequest } from '@/__tests__/mocks/next-request';

// Mock the filestore module
jest.mock('@/lib/filestore');

const mockedReadBirthdays = readBirthdays as jest.MockedFunction<typeof readBirthdays>;
const mockedWriteBirthdays = writeBirthdays as jest.MockedFunction<typeof writeBirthdays>;

// Helper to create mock params
const createMockParams = (id: string) => ({
  params: Promise.resolve({ id }),
});

describe('PUT /api/birthdays/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success Cases', () => {
    it('should update birthday and return 200', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('PUT', {
        name: 'Paula Schmidt',
        birthdate: '26.12.2000',
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.birthday.name).toBe('Paula Schmidt');
      expect(data.birthday.birthDate).toBe('2000-12-26');
    });

    it('should preserve UUID when updating', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('PUT', {
        name: 'Updated Name',
        birthdate: '15.06.1990',
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(data.birthday.id).toBe('test-id-001');
    });

    it('should update updatedAt timestamp', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('PUT', {
        name: 'Updated Name',
        birthdate: '15.06.1990',
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(data.birthday).toHaveProperty('updatedAt');
      expect(data.birthday.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should convert German date to ISO format', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('PUT', {
        name: 'Test Person',
        birthdate: '25.12.2000',
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(data.birthday.birthDate).toBe('2000-12-25');
    });

    it('should handle date without year (DD.MM.)', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('PUT', {
        name: 'Test Person',
        birthdate: '15.06.',
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.birthday.birthDate).toBe('--06-15');
    });

    it('should trim whitespace from name', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('PUT', {
        name: '  Trimmed Name  ',
        birthdate: '15.06.1990',
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(data.birthday.name).toBe('Trimmed Name');
    });

    it('should call writeBirthdays with updated store', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('PUT', {
        name: 'Updated',
        birthdate: '15.06.1990',
      });

      // Act
      await PUT(request, createMockParams('test-id-001'));

      // Assert
      expect(mockedWriteBirthdays).toHaveBeenCalledTimes(1);
      const calledWith = mockedWriteBirthdays.mock.calls[0][0];
      expect(calledWith.birthdays).toHaveLength(3); // Same length, just updated
    });
  });

  describe('Error Cases - Not Found', () => {
    it('should return 404 for non-existent ID', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);

      const request = createMockRequest('PUT', {
        name: 'Updated Name',
        birthdate: '15.06.1990',
      });

      // Act
      const response = await PUT(request, createMockParams('non-existent-id'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.error).toBe('Geburtstag nicht gefunden');
    });

    it('should not call writeBirthdays when ID not found', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);

      const request = createMockRequest('PUT', {
        name: 'Updated Name',
        birthdate: '15.06.1990',
      });

      // Act
      await PUT(request, createMockParams('non-existent-id'));

      // Assert
      expect(mockedWriteBirthdays).not.toHaveBeenCalled();
    });
  });

  describe('Validation Errors - Required Fields', () => {
    it('should return 400 when name is missing', async () => {
      // Arrange
      const request = createMockRequest('PUT', {
        birthdate: '15.06.1990',
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Name und Geburtsdatum sind erforderlich');
    });

    it('should return 400 when birthdate is missing', async () => {
      // Arrange
      const request = createMockRequest('PUT', {
        name: 'Max Mustermann',
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Name und Geburtsdatum sind erforderlich');
    });

    it('should return 400 when name is empty string', async () => {
      // Arrange
      const request = createMockRequest('PUT', {
        name: '',
        birthdate: '15.06.1990',
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Name und Geburtsdatum sind erforderlich');
    });
  });

  describe('Validation Errors - Name Validation', () => {
    it('should return 400 for name with only whitespace', async () => {
      // Arrange
      const request = createMockRequest('PUT', {
        name: '   ',
        birthdate: '15.06.1990',
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });
  });

  describe('Validation Errors - Date Format', () => {
    it('should return 400 for invalid date format', async () => {
      // Arrange
      const request = createMockRequest('PUT', {
        name: 'Max Mustermann',
        birthdate: 'invalid',
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return 400 for invalid day (32.06.1990)', async () => {
      // Arrange
      const request = createMockRequest('PUT', {
        name: 'Max Mustermann',
        birthdate: '32.06.1990',
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return 400 for invalid month (15.13.1990)', async () => {
      // Arrange
      const request = createMockRequest('PUT', {
        name: 'Max Mustermann',
        birthdate: '15.13.1990',
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should return 400 for date in future', async () => {
      // Arrange
      const futureYear = new Date().getFullYear() + 1;
      const request = createMockRequest('PUT', {
        name: 'Max Mustermann',
        birthdate: `15.06.${futureYear}`,
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toMatch(/Zukunft/i);
    });
  });

  describe('Edge Cases', () => {
    it('should return 400 when germanDateToISO returns null', async () => {
      // Arrange
      const request = createMockRequest('PUT', {
        name: 'Test Person',
        birthdate: '00.00.0000', // Invalid date that might pass initial validation
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });
  });

  describe('Error Handling', () => {
    it('should return 500 when filestore read fails', async () => {
      // Arrange
      mockedReadBirthdays.mockRejectedValue(new Error('File read error'));

      const request = createMockRequest('PUT', {
        name: 'Max Mustermann',
        birthdate: '15.06.1990',
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Fehler beim Aktualisieren des Geburtstags');
    });

    it('should return 500 when filestore write fails', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);
      mockedWriteBirthdays.mockRejectedValue(new Error('File write error'));

      const request = createMockRequest('PUT', {
        name: 'Max Mustermann',
        birthdate: '15.06.1990',
      });

      // Act
      const response = await PUT(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Fehler beim Aktualisieren des Geburtstags');
    });
  });
});

describe('DELETE /api/birthdays/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success Cases', () => {
    it('should delete birthday and return 200', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('DELETE');

      // Act
      const response = await DELETE(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Geburtstag erfolgreich gelöscht');
    });

    it('should remove birthday from store', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('DELETE');

      // Act
      await DELETE(request, createMockParams('test-id-001'));

      // Assert
      expect(mockedWriteBirthdays).toHaveBeenCalledTimes(1);
      const calledWith = mockedWriteBirthdays.mock.calls[0][0];
      expect(calledWith.birthdays).toHaveLength(2); // 3 - 1 = 2
      expect(calledWith.birthdays.find((b) => b.id === 'test-id-001')).toBeUndefined();
    });

    it('should call writeBirthdays once', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('DELETE');

      // Act
      await DELETE(request, createMockParams('test-id-001'));

      // Assert
      expect(mockedWriteBirthdays).toHaveBeenCalledTimes(1);
    });

    it('should delete correct birthday by ID', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('DELETE');

      // Act
      await DELETE(request, createMockParams('test-id-002'));

      // Assert
      const calledWith = mockedWriteBirthdays.mock.calls[0][0];
      expect(calledWith.birthdays.find((b) => b.id === 'test-id-002')).toBeUndefined();
      expect(calledWith.birthdays.find((b) => b.id === 'test-id-001')).toBeDefined();
      expect(calledWith.birthdays.find((b) => b.id === 'test-id-003')).toBeDefined();
    });
  });

  describe('Error Cases - Not Found', () => {
    it('should return 404 for non-existent ID', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);

      const request = createMockRequest('DELETE');

      // Act
      const response = await DELETE(request, createMockParams('non-existent-id'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.error).toBe('Geburtstag nicht gefunden');
    });

    it('should not call writeBirthdays when ID not found', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);

      const request = createMockRequest('DELETE');

      // Act
      await DELETE(request, createMockParams('non-existent-id'));

      // Assert
      expect(mockedWriteBirthdays).not.toHaveBeenCalled();
    });

    it('should return German error message for not found', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);

      const request = createMockRequest('DELETE');

      // Act
      const response = await DELETE(request, createMockParams('missing-id'));
      const data = await response.json();

      // Assert
      expect(data.error).toBe('Geburtstag nicht gefunden');
    });
  });

  describe('Error Handling', () => {
    it('should return 500 when filestore read fails', async () => {
      // Arrange
      mockedReadBirthdays.mockRejectedValue(new Error('File read error'));

      const request = createMockRequest('DELETE');

      // Act
      const response = await DELETE(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Fehler beim Löschen des Geburtstags');
    });

    it('should return 500 when filestore write fails', async () => {
      // Arrange
      const store = structuredClone(POPULATED_STORE);
      mockedReadBirthdays.mockResolvedValue(store);
      mockedWriteBirthdays.mockRejectedValue(new Error('File write error'));

      const request = createMockRequest('DELETE');

      // Act
      const response = await DELETE(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Fehler beim Löschen des Geburtstags');
    });

    it('should return German error message for server errors', async () => {
      // Arrange
      mockedReadBirthdays.mockRejectedValue(new Error('Disk full'));

      const request = createMockRequest('DELETE');

      // Act
      const response = await DELETE(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(data.error).toBe('Fehler beim Löschen des Geburtstags');
    });
  });

  describe('Edge Cases', () => {
    it('should handle deletion of last remaining birthday', async () => {
      // Arrange
      const store = {
        version: '1.0.0',
        birthdays: [BIRTHDAY_WITH_YEAR],
      };
      mockedReadBirthdays.mockResolvedValue(store);
      mockedWriteBirthdays.mockResolvedValue();

      const request = createMockRequest('DELETE');

      // Act
      const response = await DELETE(request, createMockParams('test-id-001'));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        message: 'Geburtstag erfolgreich gelöscht',
      });
      const calledWith = mockedWriteBirthdays.mock.calls[0][0];
      expect(calledWith.birthdays).toHaveLength(0);
    });
  });
});
