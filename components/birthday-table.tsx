// T018-T025: BirthdayTable component
import { BirthdayWithOccurrence } from '@/types/birthday';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { isMilestoneBirthday } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

export interface BirthdayTableProps {
  birthdays: BirthdayWithOccurrence[];
  emptyMessage?: string;
  className?: string;
  onEdit?: (birthday: BirthdayWithOccurrence) => void;
  onDelete?: (birthday: BirthdayWithOccurrence) => void;
}

export function BirthdayTable({
  birthdays,
  emptyMessage = 'Keine Geburtstage anzuzeigen',
  className = '',
  onEdit,
  onDelete,
}: BirthdayTableProps) {
  // T024: Empty state handling
  if (birthdays.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  // T022: Date formatting helper - German locale (de-DE) - DD.MM. format (year shown in table header)
  const formatDate = (date: Date): string => {
    // Format: DD.MM. (without year, as year is shown in table heading)
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}.${month}.`;
  };

  return (
    // T025: Responsive wrapper with overflow-x-auto for mobile scrolling
    <div className={`overflow-x-auto ${className}`}>
      <Table>
        {/* T020: TableHeader with Date, Name (includes Age) columns - German translation */}
        <TableHeader>
          <TableRow>
            <TableHead>Datum</TableHead>
            <TableHead>Name</TableHead>
            {(onEdit || onDelete) && <TableHead className="w-[120px]">Aktionen</TableHead>}
          </TableRow>
        </TableHeader>
        {/* T021: TableBody with map over birthdays array */}
        <TableBody>
          {birthdays.map((birthday) => {
            // T009: Check if this is a milestone birthday
            const isMilestone = isMilestoneBirthday(birthday.age);

            return (
              <TableRow
                key={birthday.id}
                className={cn(
                  isMilestone && "bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                )}
              >
                {/* T022: Date formatting for nextOccurrence display */}
                <TableCell>{formatDate(birthday.nextOccurrence)}</TableCell>
                {/* T023: Name with age in parentheses (e.g., "Max Mustermann (24 Jahre)") */}
                <TableCell>
                  {birthday.name}
                  {birthday.age !== null && ` (${birthday.age} Jahre)`}
                </TableCell>
                {(onEdit || onDelete) && (
                  <TableCell>
                    <div className="flex gap-1">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(birthday)}
                          className="h-11 w-11 min-h-[44px] min-w-[44px]"
                          aria-label="Geburtstag bearbeiten"
                          title="Geburtstag bearbeiten"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(birthday)}
                          className="h-11 w-11 min-h-[44px] min-w-[44px] text-destructive hover:text-destructive hover:bg-destructive/10"
                          aria-label="Geburtstag löschen"
                          title="Geburtstag löschen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
