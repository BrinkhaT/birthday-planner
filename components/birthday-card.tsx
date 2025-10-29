import { Birthday, BirthdayWithOccurrence } from '@/types/birthday';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { formatBirthDate } from '@/lib/utils';

interface BirthdayCardProps {
  birthday: Birthday | BirthdayWithOccurrence;
  onEdit?: (birthday: Birthday | BirthdayWithOccurrence) => void;
  onDelete?: (birthday: Birthday | BirthdayWithOccurrence) => void;
}

// T016-T017: Check if birthday has age property
function hasAge(birthday: Birthday | BirthdayWithOccurrence): birthday is BirthdayWithOccurrence {
  return 'age' in birthday;
}

export function BirthdayCard({ birthday, onEdit, onDelete }: BirthdayCardProps) {
  const age = hasAge(birthday) ? birthday.age : null;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{birthday.name}</CardTitle>
            <CardDescription>
              {formatBirthDate(birthday.birthDate)}
              {age !== null ? (<><br />{`${age} Jahre`}</>) : null}
            </CardDescription>
          </div>
          {(onEdit || onDelete) && (
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
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
