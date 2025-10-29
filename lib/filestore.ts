import { readFile, writeFile, rename, mkdir } from 'fs/promises';
import { join } from 'path';
import { BirthdayStore } from '@/types/birthday';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), 'data');

export async function readBirthdays(): Promise<BirthdayStore> {
  const filePath = join(DATA_DIR, 'birthdays.json');

  try {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data) as BirthdayStore;
  } catch (error: unknown) {
    // If file doesn't exist, create it with empty data
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      console.log('Birthday data file not found, creating empty file...');
      const emptyStore: BirthdayStore = {
        version: '1.0.0',
        birthdays: [],
      };

      // Ensure data directory exists
      try {
        await mkdir(DATA_DIR, { recursive: true });
      } catch {
        // Directory might already exist, ignore
      }

      // Create empty file
      await writeFile(filePath, JSON.stringify(emptyStore, null, 2), 'utf-8');
      return emptyStore;
    }

    // For other errors (invalid JSON, permissions, etc.), log and return empty
    console.error('Error reading birthdays:', error);
    return {
      version: '1.0.0',
      birthdays: [],
    };
  }
}

export async function writeBirthdays(store: BirthdayStore): Promise<void> {
  const filePath = join(DATA_DIR, 'birthdays.json');
  const temp = filePath + '.tmp';

  try {
    // Ensure data directory exists
    await mkdir(DATA_DIR, { recursive: true });

    // Write to temporary file first
    await writeFile(temp, JSON.stringify(store, null, 2), 'utf-8');
    // Atomic rename (ensures consistency)
    await rename(temp, filePath);
  } catch (error) {
    console.error('Error writing birthdays:', error);
    throw error;
  }
}
