'use client';

import { useEffect, useState } from 'react';
import { BirthdayCard } from '@/components/birthday-card';
import { Birthday } from '@/types/birthday';

export default function Home() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading birthdays...</p>
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
                Error Loading Birthdays
              </h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Try Again
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
        <header className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">
            🎂 Birthday Planner
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Never miss a birthday again!
          </p>
        </header>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6">
            Upcoming Birthdays
          </h2>

          {birthdays.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No birthdays found. Add some to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {birthdays.map((birthday) => (
                <BirthdayCard key={birthday.id} birthday={birthday} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
