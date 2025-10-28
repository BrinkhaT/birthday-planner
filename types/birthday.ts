export interface Birthday {
  id: string;
  name: string;
  birthDate: string; // Format: MM.DD.YY
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
}

export interface BirthdayStore {
  version: string;
  birthdays: Birthday[];
}

export interface BirthdayValidationError {
  field: string;
  message: string;
  value: any;
}
