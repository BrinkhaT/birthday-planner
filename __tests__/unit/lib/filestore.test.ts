/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
// Mock fs/promises module BEFORE any imports
jest.mock('fs/promises');

// Import fixtures
import {
  EMPTY_STORE,
  POPULATED_STORE,
  BIRTHDAY_WITH_YEAR,
  BIRTHDAY_WITHOUT_YEAR,
  BIRTHDAY_LEAP_YEAR,
} from '@/__tests__/fixtures/birthdays';

// Import the mocked fs/promises functions
import { readFile, writeFile, rename, mkdir } from 'fs/promises';

// Import the module under test
import { readBirthdays, writeBirthdays } from '@/lib/filestore';

// Cast to jest mocks
const mockReadFile = readFile as jest.MockedFunction<typeof readFile>;
const mockWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;
const mockRename = rename as jest.MockedFunction<typeof rename>;
const mockMkdir = mkdir as jest.MockedFunction<typeof mkdir>;

// Helper to create ENOENT error
const mockENOENTError = () => {
  const error: any = new Error('ENOENT: no such file or directory');
  error.code = 'ENOENT';
  return error;
};

// Helper to create EPERM error
const mockEPERMError = () => {
  const error: any = new Error('EPERM: operation not permitted');
  error.code = 'EPERM';
  return error;
};

// THESE TESTS ARE SKIPPED - See __tests__/integration/lib/filestore.test.ts for working integration tests
// Reason: Jest/SWC mocking limitations with Node.js built-in modules
// Documentation: __tests__/unit/lib/filestore.test.README.md
describe.skip('filestore', () => {
  const DATA_DIR = process.env.DATA_DIR || '/tmp/test-data';
  const FILE_PATH = `${DATA_DIR}/birthdays.json`;
  const TEMP_PATH = `${FILE_PATH}.tmp`;

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readBirthdays', () => {
    describe('Success scenarios (T029)', () => {
      it('should read and parse valid JSON file', async () => {
        // Arrange
        const mockData = JSON.stringify(POPULATED_STORE);
        mockReadFile.mockResolvedValue(mockData as any);

        // Act
        const result = await readBirthdays();

        // Assert
        expect(mockReadFile).toHaveBeenCalledWith(FILE_PATH, 'utf-8');
        expect(result).toEqual(POPULATED_STORE);
        expect(result.version).toBe('1.0.0');
        expect(result.birthdays).toHaveLength(3);
        expect(result.birthdays[0]).toEqual(BIRTHDAY_WITH_YEAR);
        expect(result.birthdays[1]).toEqual(BIRTHDAY_WITHOUT_YEAR);
        expect(result.birthdays[2]).toEqual(BIRTHDAY_LEAP_YEAR);
      });

      it('should return BirthdayStore with correct structure', async () => {
        // Arrange
        const mockData = JSON.stringify(EMPTY_STORE);
        mockReadFile.mockResolvedValue(mockData as any);

        // Act
        const result = await readBirthdays();

        // Assert
        expect(result).toHaveProperty('version');
        expect(result).toHaveProperty('birthdays');
        expect(Array.isArray(result.birthdays)).toBe(true);
      });

      it('should handle empty store correctly', async () => {
        // Arrange
        const mockData = JSON.stringify(EMPTY_STORE);
        mockReadFile.mockResolvedValue(mockData as any);

        // Act
        const result = await readBirthdays();

        // Assert
        expect(result).toEqual(EMPTY_STORE);
        expect(result.birthdays).toHaveLength(0);
      });

      it('should handle store with multiple birthdays', async () => {
        // Arrange
        const storeWithMany = {
          version: '1.0.0',
          birthdays: [
            BIRTHDAY_WITH_YEAR,
            BIRTHDAY_WITHOUT_YEAR,
            BIRTHDAY_LEAP_YEAR,
            { id: 'test-004', name: 'Test User', birthDate: '1990-01-01' },
            { id: 'test-005', name: 'Another User', birthDate: '--05-20' },
          ],
        };
        const mockData = JSON.stringify(storeWithMany);
        mockReadFile.mockResolvedValue(mockData as any);

        // Act
        const result = await readBirthdays();

        // Assert
        expect(result.birthdays).toHaveLength(5);
      });
    });

    describe('ENOENT error handling (T030)', () => {
      it('should create empty file when file does not exist', async () => {
        // Arrange
        const error = mockENOENTError();
        mockReadFile.mockRejectedValue(error);
        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockResolvedValue(undefined as any);

        // Act
        const result = await readBirthdays();

        // Assert
        expect(mockReadFile).toHaveBeenCalledWith(FILE_PATH, 'utf-8');
        expect(mockMkdir).toHaveBeenCalledWith(DATA_DIR, { recursive: true });
        expect(mockWriteFile).toHaveBeenCalledWith(
          FILE_PATH,
          JSON.stringify(EMPTY_STORE, null, 2),
          'utf-8'
        );
        expect(result).toEqual(EMPTY_STORE);
      });

      it('should create directory recursively', async () => {
        // Arrange
        const error = mockENOENTError();
        mockReadFile.mockRejectedValue(error);
        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockResolvedValue(undefined as any);

        // Act
        await readBirthdays();

        // Assert
        expect(mockMkdir).toHaveBeenCalledWith(DATA_DIR, { recursive: true });
      });

      it('should return empty store after creating file', async () => {
        // Arrange
        const error = mockENOENTError();
        mockReadFile.mockRejectedValue(error);
        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockResolvedValue(undefined as any);

        // Act
        const result = await readBirthdays();

        // Assert
        expect(result).toEqual(EMPTY_STORE);
        expect(result.version).toBe('1.0.0');
        expect(result.birthdays).toEqual([]);
      });

      it('should handle mkdir failure gracefully', async () => {
        // Arrange
        const enoentError = mockENOENTError();
        const mkdirError = new Error('mkdir failed');
        mockReadFile.mockRejectedValue(enoentError);
        mockMkdir.mockRejectedValue(mkdirError);
        mockWriteFile.mockResolvedValue(undefined as any);

        // Act
        const result = await readBirthdays();

        // Assert
        // Should still proceed to write file even if mkdir fails (directory might exist)
        expect(mockWriteFile).toHaveBeenCalled();
        expect(result).toEqual(EMPTY_STORE);
      });
    });

    describe('Corrupt JSON handling (T031)', () => {
      it('should return empty store when JSON is invalid', async () => {
        // Arrange
        const invalidJson = '{ invalid json }';
        mockReadFile.mockResolvedValue(invalidJson as any);

        // Spy on console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        // Act
        const result = await readBirthdays();

        // Assert
        expect(result).toEqual(EMPTY_STORE);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error reading birthdays:',
          expect.any(SyntaxError)
        );

        // Cleanup
        consoleErrorSpy.mockRestore();
      });

      it('should log error when JSON is corrupt', async () => {
        // Arrange
        const corruptJson = '{"version": "1.0.0", "birthdays": [unclosed';
        mockReadFile.mockResolvedValue(corruptJson as any);

        // Spy on console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        // Act
        await readBirthdays();

        // Assert
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error reading birthdays:',
          expect.any(SyntaxError)
        );

        // Cleanup
        consoleErrorSpy.mockRestore();
      });

      it('should handle empty file content', async () => {
        // Arrange
        mockReadFile.mockResolvedValue('' as any);

        // Spy on console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        // Act
        const result = await readBirthdays();

        // Assert
        expect(result).toEqual(EMPTY_STORE);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error reading birthdays:',
          expect.any(SyntaxError)
        );

        // Cleanup
        consoleErrorSpy.mockRestore();
      });

      it('should handle malformed JSON objects', async () => {
        // Arrange
        const malformedJson = '{"version": "1.0.0"}'; // Missing birthdays array
        mockReadFile.mockResolvedValue(malformedJson as any);

        // Act
        const result = await readBirthdays();

        // Assert
        expect(result).toHaveProperty('version');
        expect(result).toHaveProperty('birthdays');
      });

      it('should handle permission errors', async () => {
        // Arrange
        const permError = mockEPERMError();
        mockReadFile.mockRejectedValue(permError);

        // Spy on console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        // Act
        const result = await readBirthdays();

        // Assert
        expect(result).toEqual(EMPTY_STORE);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error reading birthdays:', permError);

        // Cleanup
        consoleErrorSpy.mockRestore();
      });
    });
  });

  describe('writeBirthdays', () => {
    describe('Success scenarios (T032)', () => {
      it('should create directory before writing', async () => {
        // Arrange
        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockResolvedValue(undefined as any);
        mockRename.mockResolvedValue(undefined as any);

        // Act
        await writeBirthdays(POPULATED_STORE);

        // Assert
        expect(mockMkdir).toHaveBeenCalledWith(DATA_DIR, { recursive: true });
      });

      it('should write to temporary file first', async () => {
        // Arrange
        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockResolvedValue(undefined as any);
        mockRename.mockResolvedValue(undefined as any);

        // Act
        await writeBirthdays(POPULATED_STORE);

        // Assert
        expect(mockWriteFile).toHaveBeenCalledWith(
          TEMP_PATH,
          JSON.stringify(POPULATED_STORE, null, 2),
          'utf-8'
        );
      });

      it('should perform atomic rename', async () => {
        // Arrange
        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockResolvedValue(undefined as any);
        mockRename.mockResolvedValue(undefined as any);

        // Act
        await writeBirthdays(POPULATED_STORE);

        // Assert
        expect(mockRename).toHaveBeenCalledWith(TEMP_PATH, FILE_PATH);
      });

      it('should write empty store correctly', async () => {
        // Arrange
        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockResolvedValue(undefined as any);
        mockRename.mockResolvedValue(undefined as any);

        // Act
        await writeBirthdays(EMPTY_STORE);

        // Assert
        expect(mockWriteFile).toHaveBeenCalledWith(
          TEMP_PATH,
          JSON.stringify(EMPTY_STORE, null, 2),
          'utf-8'
        );
        expect(mockRename).toHaveBeenCalledWith(TEMP_PATH, FILE_PATH);
      });

      it('should format JSON with 2-space indentation', async () => {
        // Arrange
        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockResolvedValue(undefined as any);
        mockRename.mockResolvedValue(undefined as any);

        // Act
        await writeBirthdays(POPULATED_STORE);

        // Assert
        const expectedJson = JSON.stringify(POPULATED_STORE, null, 2);
        expect(mockWriteFile).toHaveBeenCalledWith(TEMP_PATH, expectedJson, 'utf-8');
      });
    });

    describe('Error handling (T033)', () => {
      it('should throw on write failure', async () => {
        // Arrange
        const writeError = new Error('Disk full');
        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockRejectedValue(writeError);

        // Spy on console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        // Act & Assert
        await expect(writeBirthdays(POPULATED_STORE)).rejects.toThrow('Disk full');
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error writing birthdays:', writeError);

        // Cleanup
        consoleErrorSpy.mockRestore();
      });

      it('should not corrupt existing file on write failure', async () => {
        // Arrange
        const writeError = new Error('Write failed');
        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockRejectedValue(writeError);

        // Act & Assert
        await expect(writeBirthdays(POPULATED_STORE)).rejects.toThrow('Write failed');

        // Verify rename was never called (file not corrupted)
        expect(mockRename).not.toHaveBeenCalled();
      });

      it('should throw on rename failure', async () => {
        // Arrange
        const renameError = new Error('Rename failed');
        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockResolvedValue(undefined as any);
        mockRename.mockRejectedValue(renameError);

        // Spy on console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        // Act & Assert
        await expect(writeBirthdays(POPULATED_STORE)).rejects.toThrow('Rename failed');
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error writing birthdays:', renameError);

        // Cleanup
        consoleErrorSpy.mockRestore();
      });

      it('should throw on mkdir failure', async () => {
        // Arrange
        const mkdirError = mockEPERMError();
        mockMkdir.mockRejectedValue(mkdirError);

        // Spy on console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        // Act & Assert
        await expect(writeBirthdays(POPULATED_STORE)).rejects.toThrow(
          'EPERM: operation not permitted'
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error writing birthdays:', mkdirError);

        // Cleanup
        consoleErrorSpy.mockRestore();
      });

      it('should log error details on failure', async () => {
        // Arrange
        const error = new Error('Some error');
        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockRejectedValue(error);

        // Spy on console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        // Act
        try {
          await writeBirthdays(POPULATED_STORE);
        } catch (e) {
          // Expected to throw
        }

        // Assert
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error writing birthdays:', error);

        // Cleanup
        consoleErrorSpy.mockRestore();
      });
    });

    describe('Atomic write behavior (T034)', () => {
      it('should verify temp file pattern (.tmp extension)', async () => {
        // Arrange
        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockResolvedValue(undefined as any);
        mockRename.mockResolvedValue(undefined as any);

        // Act
        await writeBirthdays(POPULATED_STORE);

        // Assert
        const writeCall = mockWriteFile.mock.calls[0];
        expect(writeCall[0]).toContain('.tmp');
        expect(writeCall[0]).toBe(TEMP_PATH);
      });

      it('should verify rename sequence (write then rename)', async () => {
        // Arrange
        const callOrder: string[] = [];
        mockMkdir.mockImplementation(async () => {
          callOrder.push('mkdir');
        });
        mockWriteFile.mockImplementation(async () => {
          callOrder.push('write');
        });
        mockRename.mockImplementation(async () => {
          callOrder.push('rename');
        });

        // Act
        await writeBirthdays(POPULATED_STORE);

        // Assert
        expect(callOrder).toEqual(['mkdir', 'write', 'rename']);
      });

      it('should ensure atomic operation (no partial writes)', async () => {
        // Arrange
        let tempFileWritten = false;
        let finalFileRenamed = false;

        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockImplementation(async () => {
          tempFileWritten = true;
        });
        mockRename.mockImplementation(async () => {
          // Rename should only happen after write completes
          expect(tempFileWritten).toBe(true);
          finalFileRenamed = true;
        });

        // Act
        await writeBirthdays(POPULATED_STORE);

        // Assert
        expect(tempFileWritten).toBe(true);
        expect(finalFileRenamed).toBe(true);
      });

      it('should write complete JSON before rename', async () => {
        // Arrange
        let writtenData = '';
        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockImplementation(async (path, data) => {
          writtenData = data as string;
        });
        mockRename.mockImplementation(async () => {
          // Verify complete JSON was written before rename
          expect(writtenData).toBeTruthy();
          expect(() => JSON.parse(writtenData)).not.toThrow();
        });

        // Act
        await writeBirthdays(POPULATED_STORE);

        // Assert
        expect(writtenData).toBe(JSON.stringify(POPULATED_STORE, null, 2));
      });

      it('should handle concurrent writes safely', async () => {
        // Arrange
        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockResolvedValue(undefined as any);
        mockRename.mockResolvedValue(undefined as any);

        // Act - simulate concurrent writes
        const write1 = writeBirthdays(POPULATED_STORE);
        const write2 = writeBirthdays(EMPTY_STORE);

        await Promise.all([write1, write2]);

        // Assert - both should complete without interference
        expect(mockWriteFile).toHaveBeenCalledTimes(2);
        expect(mockRename).toHaveBeenCalledTimes(2);
      });

      it('should use consistent temp file naming', async () => {
        // Arrange
        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockResolvedValue(undefined as any);
        mockRename.mockResolvedValue(undefined as any);

        // Act
        await writeBirthdays(POPULATED_STORE);

        // Assert
        const writeCallPath = mockWriteFile.mock.calls[0][0];
        const renameFromPath = mockRename.mock.calls[0][0];
        expect(writeCallPath).toBe(renameFromPath);
        expect(writeCallPath).toBe(TEMP_PATH);
      });
    });

    describe('Integration scenarios', () => {
      it('should handle full write-read cycle', async () => {
        // Arrange
        let savedData = '';

        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockImplementation(async (path, data) => {
          savedData = data as string;
        });
        mockRename.mockResolvedValue(undefined as any);
        mockReadFile.mockImplementation(async () => savedData as any);

        // Act - Write
        await writeBirthdays(POPULATED_STORE);

        // Act - Read
        const result = await readBirthdays();

        // Assert
        expect(result).toEqual(POPULATED_STORE);
      });

      it('should preserve data integrity across multiple writes', async () => {
        // Arrange
        let currentData = JSON.stringify(EMPTY_STORE);

        mockMkdir.mockResolvedValue(undefined as any);
        mockWriteFile.mockImplementation(async (path, data) => {
          currentData = data as string;
        });
        mockRename.mockResolvedValue(undefined as any);
        mockReadFile.mockImplementation(async () => currentData as any);

        // Act - Multiple writes
        await writeBirthdays(EMPTY_STORE);
        const result1 = await readBirthdays();

        await writeBirthdays(POPULATED_STORE);
        const result2 = await readBirthdays();

        // Assert
        expect(result1).toEqual(EMPTY_STORE);
        expect(result2).toEqual(POPULATED_STORE);
        expect(result2.birthdays).toHaveLength(3);
      });
    });
  });
});
