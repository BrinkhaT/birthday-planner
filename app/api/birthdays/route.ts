import { NextResponse } from 'next/server';
import { readBirthdays } from '@/lib/filestore';

export async function GET() {
  try {
    const birthdayStore = await readBirthdays();
    return NextResponse.json(birthdayStore);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to load birthdays',
        message: 'Unable to read birthday data from storage',
      },
      { status: 500 }
    );
  }
}
