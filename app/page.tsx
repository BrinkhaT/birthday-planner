'use client';

import { useEffect, useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { BirthdayCard } from '@/components/birthday-card';
import { BirthdayTable } from '@/components/birthday-table';
import { BirthdayModal } from '@/components/birthday-modal';
import { DeleteConfirmation } from '@/components/delete-confirmation';
import { ThemeToggle } from '@/components/theme-toggle';
import { Birthday } from '@/types/birthday';
import { splitBirthdays, groupBirthdaysByYear } from '@/lib/date-utils';
import { i18nDE } from '@/lib/i18n-de';

export default function Home() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state for add/edit operations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [birthdayToDelete, setBirthdayToDelete] = useState<Birthday | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchBirthdays() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/birthdays');

        if (!response.ok) {
          throw new Error('Failed to load birthdays');
        }

        const data = await response.json();
        setBirthdays(data.birthdays || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchBirthdays();
  }, []);

  // T018: Handle edit button click
  const handleEdit = (birthday: Birthday) => {
    setModalMode('edit');
    setSelectedBirthday(birthday);
    setIsModalOpen(true);
  };

  // T026: Handle delete button click
  const handleDelete = (birthday: Birthday) => {
    setBirthdayToDelete(birthday);
    setIsDeleteDialogOpen(true);
  };

  // T027, T028: Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!birthdayToDelete) return;

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/birthdays/${birthdayToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || i18nDE.error.deleteFailed);
      }

      // Optimistic update: Remove birthday from state
      setBirthdays((prev) => prev.filter((b) => b.id !== birthdayToDelete.id));

      // Close dialog and reset state
      setIsDeleteDialogOpen(false);
      setBirthdayToDelete(null);
    } catch (err) {
      console.error('Error deleting birthday:', err);
      // In a real app, you might want to show an error toast here
      alert(err instanceof Error ? err.message : i18nDE.error.deleteFailed);
    } finally {
      setIsDeleting(false);
    }
  };

  // T012, T013, T020: Handle birthday form submission (add and edit modes)
  const handleBirthdaySubmit = async (data: { name: string; birthdate: string }) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (modalMode === 'add') {
        // Add mode: POST /api/birthdays/create
        const response = await fetch('/api/birthdays/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || i18nDE.error.saveFailed);
        }

        const result = await response.json();

        // Optimistic update: Add new birthday to state
        setBirthdays((prev) => [...prev, result.birthday]);
      } else if (modalMode === 'edit' && selectedBirthday) {
        // Edit mode: PUT /api/birthdays/[id]
        const response = await fetch(`/api/birthdays/${selectedBirthday.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || i18nDE.error.saveFailed);
        }

        const result = await response.json();

        // Optimistic update: Update birthday in state
        setBirthdays((prev) =>
          prev.map((b) => (b.id === selectedBirthday.id ? result.birthday : b))
        );
      }

      // Close modal and reset state
      setIsModalOpen(false);
      setSelectedBirthday(null);
      setSubmitError(null);
    } catch (err) {
      console.error('Error submitting birthday:', err);
      setSubmitError(err instanceof Error ? err.message : i18nDE.error.saveFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  // T012: Add useMemo hook to compute split birthdays
  const { upcoming, future } = useMemo(() => {
    const today = new Date();
    return splitBirthdays(birthdays, today);
  }, [birthdays]);

  // Group future birthdays by year
  const futureByYear = useMemo(() => {
    return groupBirthdaysByYear(future);
  }, [future]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Geburtstage werden geladen...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-destructive mb-2">
                Fehler beim Laden der Geburtstage
              </h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Erneut versuchen
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
        <header className="mb-8 sm:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">
              🎂 Geburtstagplaner
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Verpasse nie wieder einen Geburtstag!
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* T013-T015: Section 1 - Upcoming Birthdays (Next 30 Days) */}
        <section aria-labelledby="upcoming-heading">
          <h2
            id="upcoming-heading"
            className="text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6"
          >
            Baldige Geburtstage
          </h2>

          {upcoming.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Keine Geburtstage in den nächsten 30 Tagen
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((birthday) => (
                <BirthdayCard
                  key={birthday.id}
                  birthday={birthday}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>

        {/* T026-T029: Section 2 - All Other Birthdays (Grouped by Year) */}
        <section aria-labelledby="future-heading" className="mt-12">
          <h2
            id="future-heading"
            className="text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6"
          >
            Alle weiteren Geburtstage
          </h2>
          {futureByYear.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Keine weiteren Geburtstage vorhanden
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {futureByYear.map(({ year, birthdays }) => (
                <div key={year}>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">
                    {year}
                  </h3>
                  <BirthdayTable
                    birthdays={birthdays}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={"mt-6"}>
          <button
              onClick={() => {
                setModalMode('add');
                setSelectedBirthday(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors min-h-[44px] min-w-[44px]"
              title={i18nDE.tooltips.addBirthday}
              aria-label={i18nDE.tooltips.addBirthday}
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">{i18nDE.buttons.add}</span>
          </button>
        </section>

        {/* Birthday Modal for Add/Edit operations */}
        <BirthdayModal
          isOpen={isModalOpen}
          mode={modalMode}
          selectedBirthday={selectedBirthday}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBirthday(null);
            setSubmitError(null);
          }}
          onSubmit={handleBirthdaySubmit}
          isLoading={isSubmitting}
          error={submitError}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmation
          isOpen={isDeleteDialogOpen}
          birthday={birthdayToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setIsDeleteDialogOpen(false);
            setBirthdayToDelete(null);
          }}
          isLoading={isDeleting}
        />
      </div>
    </main>
  );
}
