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

  // T022: Date formatting helper - German locale (de-DE)
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    // T025: Responsive wrapper with overflow-x-auto for mobile scrolling
    <div className={`overflow-x-auto ${className}`}>
      <Table>
        {/* T020: TableHeader with Date, Name, Age columns - German translation */}
        <TableHeader>
          <TableRow>
            <TableHead>Datum</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Alter</TableHead>
            {(onEdit || onDelete) && <TableHead className="w-[120px]">Aktionen</TableHead>}
          </TableRow>
        </TableHeader>
        {/* T021: TableBody with map over birthdays array */}
        <TableBody>
          {birthdays.map((birthday) => (
            <TableRow key={birthday.id}>
              {/* T022: Date formatting for nextOccurrence display */}
              <TableCell>{formatDate(birthday.nextOccurrence)}</TableCell>
              <TableCell>{birthday.name}</TableCell>
              {/* T023: Age display with "—" em dash for null age */}
              <TableCell>{birthday.age !== null ? birthday.age : '—'}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
