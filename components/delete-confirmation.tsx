"use client";

import { Birthday } from "@/types/birthday";
import { i18nDE } from "@/lib/i18n-de";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DeleteConfirmationProps {
  isOpen: boolean;
  birthday: Birthday | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmation({
  isOpen,
  birthday,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{i18nDE.modal.deleteTitle}</DialogTitle>
          <DialogDescription>
            {birthday && i18nDE.confirmation.deleteName(birthday.name)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{i18nDE.confirmation.deleteMessage}</p>
          <p className="text-sm text-destructive font-medium">
            {i18nDE.confirmation.deleteWarning}
          </p>
        </div>
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
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive rounded-md hover:bg-destructive/90 disabled:opacity-50"
          >
            {isLoading ? i18nDE.loading.deleting : i18nDE.buttons.delete}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
