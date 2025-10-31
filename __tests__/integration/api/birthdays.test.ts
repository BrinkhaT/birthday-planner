/**
 * Integration Tests: GET /api/birthdays
 *
 * Tests the birthday list API endpoint for success and error scenarios.
 * Verifies proper status codes, response formats, and error handling.
 */

import { GET } from '@/app/api/birthdays/route';
import { readBirthdays } from '@/lib/filestore';
import { EMPTY_STORE, POPULATED_STORE } from '@/__tests__/fixtures/birthdays';

// Mock the filestore module
jest.mock('@/lib/filestore');

const mockedReadBirthdays = readBirthdays as jest.MockedFunction<typeof readBirthdays>;

describe('GET /api/birthdays', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success Cases', () => {
    it('should return 200 status code', async () => {
      // Arrange
      mockedReadBirthdays.mockResolvedValue(POPULATED_STORE);

      // Act
      const response = await GET();

      // Assert
      expect(response.status).toBe(200);
    });

    it('should return birthday store with populated data', async () => {
      // Arrange
      mockedReadBirthdays.mockResolvedValue(POPULATED_STORE);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(data).toEqual(POPULATED_STORE);
      expect(data.version).toBe('1.0.0');
      expect(data.birthdays).toHaveLength(3);
    });

    it('should return empty birthday store when no birthdays exist', async () => {
      // Arrange
      mockedReadBirthdays.mockResolvedValue(EMPTY_STORE);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual(EMPTY_STORE);
      expect(data.birthdays).toHaveLength(0);
    });

    it('should call readBirthdays once', async () => {
      // Arrange
      mockedReadBirthdays.mockResolvedValue(POPULATED_STORE);

      // Act
      await GET();

      // Assert
      expect(mockedReadBirthdays).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Cases', () => {
    it('should return 500 when filestore read fails', async () => {
      // Arrange
      mockedReadBirthdays.mockRejectedValue(new Error('Failed to read file'));

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: 'Failed to load birthdays',
        message: 'Unable to read birthday data from storage',
      });
    });

    it('should return error message when filestore read fails', async () => {
      // Arrange
      mockedReadBirthdays.mockRejectedValue(new Error('File not found'));

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Failed to load birthdays');
      expect(data).toHaveProperty('message');
      expect(data.message).toBe('Unable to read birthday data from storage');
    });

    it('should handle filesystem permission errors', async () => {
      // Arrange
      mockedReadBirthdays.mockRejectedValue(new Error('EACCES: permission denied'));

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to load birthdays');
    });

    it('should handle corrupted file errors', async () => {
      // Arrange
      mockedReadBirthdays.mockRejectedValue(new Error('Invalid JSON'));

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to load birthdays');
    });
  });

  describe('Response Format', () => {
    it('should return JSON content type', async () => {
      // Arrange
      mockedReadBirthdays.mockResolvedValue(POPULATED_STORE);

      // Act
      const response = await GET();

      // Assert
      expect(response.headers.get('content-type')).toContain('application/json');
    });

    it('should return valid BirthdayStore structure', async () => {
      // Arrange
      mockedReadBirthdays.mockResolvedValue(POPULATED_STORE);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(data).toHaveProperty('version');
      expect(data).toHaveProperty('birthdays');
      expect(Array.isArray(data.birthdays)).toBe(true);
    });
  });
});
