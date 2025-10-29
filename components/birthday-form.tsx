"use client";

import { useState, useEffect } from "react";
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

export function BirthdayForm({ birthday, onSubmit, onCancel, isLoading = false }: BirthdayFormProps) {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [errors, setErrors] = useState<{ name?: string; birthdate?: string }>({});

  // Pre-fill form when editing
  useEffect(() => {
    if (birthday) {
      setName(birthday.name);
      // Convert ISO format to German format for display in input field
      const germanDate = isoToGermanDate(birthday.birthDate);
      setBirthdate(germanDate || birthday.birthDate);
    } else {
      setName("");
      setBirthdate("");
    }
    setErrors({});
  }, [birthday]);

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
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
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
          className={errors.birthdate ? "border-red-500" : ""}
        />
        {errors.birthdate && (
          <p className="text-sm text-red-500">{errors.birthdate}</p>
        )}
      </div>

      {/* Form buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          {i18nDE.buttons.cancel}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? i18nDE.loading.saving : i18nDE.buttons.save}
        </button>
      </div>
    </form>
  );
}
