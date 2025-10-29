import { NextResponse } from 'next/server';
import { readBirthdays, writeBirthdays } from '@/lib/filestore';
import { Birthday } from '@/types/birthday';
import { germanDateToISO, validateBirthdayDate, validateBirthdayName } from '@/lib/validations';

/**
 * PUT /api/birthdays/[id]
 * Update an existing birthday entry
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, birthdate } = body;

    // Validate required fields
    if (!name || !birthdate) {
      return NextResponse.json(
        { error: 'Name und Geburtsdatum sind erforderlich' },
        { status: 400 }
      );
    }

    // Validate name
    const nameError = validateBirthdayName(name);
    if (nameError) {
      return NextResponse.json(
        { error: nameError },
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

    // Find birthday by ID
    const birthdayIndex = data.birthdays.findIndex((b) => b.id === id);
    if (birthdayIndex === -1) {
      return NextResponse.json(
        { error: 'Geburtstag nicht gefunden' },
        { status: 404 }
      );
    }

    // Update birthday entry
    const updatedBirthday: Birthday = {
      ...data.birthdays[birthdayIndex],
      name: name.trim(),
      birthDate: isoDate,
      updatedAt: new Date().toISOString(),
    };

    data.birthdays[birthdayIndex] = updatedBirthday;

    // Write back to FileStore
    await writeBirthdays(data);

    return NextResponse.json(
      { success: true, birthday: updatedBirthday },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating birthday:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Geburtstags' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/birthdays/[id]
 * Delete a birthday entry
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Read existing birthdays
    const data = await readBirthdays();

    // Find birthday by ID
    const birthdayIndex = data.birthdays.findIndex((b) => b.id === id);
    if (birthdayIndex === -1) {
      return NextResponse.json(
        { error: 'Geburtstag nicht gefunden' },
        { status: 404 }
      );
    }

    // Remove birthday from array
    data.birthdays.splice(birthdayIndex, 1);

    // Write back to FileStore
    await writeBirthdays(data);

    return NextResponse.json(
      { success: true, message: 'Geburtstag erfolgreich gelöscht' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting birthday:', error);
    return NextResponse.json(
      { error: 'Fehler beim Löschen des Geburtstags' },
      { status: 500 }
    );
  }
}
