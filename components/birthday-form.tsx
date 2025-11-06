"use client";

import { useState } from "react";
import { Birthday } from "@/types/birthday";
import { validateBirthdayName, validateBirthdayDate, isoToGermanDate } from "@/lib/validations";
import { i18nDE } from "@/lib/i18n-de";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BirthdayFormProps {
  birthday?: Birthday | null;
  onSubmit: (data: { name: string; birthdate: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Helper function to get initial form values
function getInitialValues(birthday?: Birthday | null) {
  if (!birthday) {
    return { name: "", birthdate: "" };
  }
  const germanDate = isoToGermanDate(birthday.birthDate);
  return {
    name: birthday.name,
    birthdate: germanDate || birthday.birthDate,
  };
}

export function BirthdayForm({ birthday, onSubmit, onCancel, isLoading = false }: BirthdayFormProps) {
  const initialValues = getInitialValues(birthday);
  const [name, setName] = useState(initialValues.name);
  const [birthdate, setBirthdate] = useState(initialValues.birthdate);
  const [errors, setErrors] = useState<{ name?: string; birthdate?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    const nameError = validateBirthdayName(name);
    const birthdateError = validateBirthdayDate(birthdate);

    if (nameError || birthdateError) {
      setErrors({
        name: nameError || undefined,
        birthdate: birthdateError || undefined,
      });
      return;
    }

    // Clear errors and submit
    setErrors({});
    onSubmit({ name: name.trim(), birthdate: birthdate.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name field */}
      <div className="space-y-2">
        <Label htmlFor="name">{i18nDE.form.nameLabel}</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={i18nDE.form.namePlaceholder}
          required
          disabled={isLoading}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Birthdate field */}
      <div className="space-y-2">
        <Label htmlFor="birthdate">{i18nDE.form.birthdateLabel}</Label>
        <Input
          id="birthdate"
          type="text"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          placeholder={i18nDE.form.birthdatePlaceholder}
          required
          disabled={isLoading}
          className={errors.birthdate ? "border-destructive" : ""}
        />
        {errors.birthdate && (
          <p className="text-sm text-destructive">{errors.birthdate}</p>
        )}
      </div>

      {/* Form buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-accent disabled:opacity-50"
        >
          {i18nDE.buttons.cancel}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? i18nDE.loading.saving : i18nDE.buttons.save}
        </button>
      </div>
    </form>
  );
}
