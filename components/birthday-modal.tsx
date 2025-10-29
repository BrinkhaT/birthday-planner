"use client";

import { Birthday } from "@/types/birthday";
import { BirthdayForm } from "@/components/birthday-form";
import { i18nDE } from "@/lib/i18n-de";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ModalMode = "add" | "edit";

interface BirthdayModalProps {
  isOpen: boolean;
  mode: ModalMode;
  selectedBirthday?: Birthday | null;
  onClose: () => void;
  onSubmit: (data: { name: string; birthdate: string }) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function BirthdayModal({
  isOpen,
  mode,
  selectedBirthday,
  onClose,
  onSubmit,
  isLoading = false,
  error = null,
}: BirthdayModalProps) {
  const title = mode === "add" ? i18nDE.modal.addTitle : i18nDE.modal.editTitle;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
        <BirthdayForm
          key={selectedBirthday?.id || "new"}
          birthday={selectedBirthday}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
