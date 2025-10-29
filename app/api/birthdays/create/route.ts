import { NextResponse } from 'next/server';
import { readBirthdays, writeBirthdays } from '@/lib/filestore';
import { Birthday } from '@/types/birthday';
import { v4 as uuidv4 } from 'uuid';
import { germanDateToISO, validateBirthdayDate } from '@/lib/validations';

/**
 * POST /api/birthdays/create
 * Create a new birthday entry
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, birthdate } = body;

    // Validate required fields
    if (!name || !birthdate) {
      return NextResponse.json(
        { error: 'Name und Geburtsdatum sind erforderlich' },
        { status: 400 }
      );
    }

    // Validate birthdate format and value
    const dateError = validateBirthdayDate(birthdate);
    if (dateError) {
      return NextResponse.json(
        { error: dateError },
        { status: 400 }
      );
    }

    // Convert German date format to ISO format
    const isoDate = germanDateToISO(birthdate);
    if (!isoDate) {
      return NextResponse.json(
        { error: 'Ungültiges Datumsformat' },
        { status: 400 }
      );
    }

    // Read existing birthdays
    const data = await readBirthdays();

    // Create new birthday entry
    const now = new Date().toISOString();
    const newBirthday: Birthday = {
      id: uuidv4(),
      name: name.trim(),
      birthDate: isoDate,
      createdAt: now,
      updatedAt: now,
    };

    // Add to birthdays array
    data.birthdays.push(newBirthday);

    // Write back to FileStore
    await writeBirthdays(data);

    return NextResponse.json(
      { success: true, birthday: newBirthday },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating birthday:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Geburtstags' },
      { status: 500 }
    );
  }
}
