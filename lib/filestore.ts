import { readFile, writeFile, rename } from 'fs/promises';
import { join } from 'path';
import { BirthdayStore, Birthday } from '@/types/birthday';

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), 'data');

export async function readBirthdays(): Promise<BirthdayStore> {
  try {
    const filePath = join(DATA_DIR, 'birthdays.json');
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data) as BirthdayStore;
  } catch (error) {
    console.error('Error reading birthdays:', error);
    // Return empty store if file doesn't exist or is invalid
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
    // Write to temporary file first
    await writeFile(temp, JSON.stringify(store, null, 2), 'utf-8');
    // Atomic rename (ensures consistency)
    await rename(temp, filePath);
  } catch (error) {
    console.error('Error writing birthdays:', error);
    throw error;
  }
}
