import { Birthday, BirthdayWithOccurrence } from '@/types/birthday';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatBirthDate } from '@/lib/utils';

interface BirthdayCardProps {
  birthday: Birthday | BirthdayWithOccurrence;
}

// T016-T017: Check if birthday has age property
function hasAge(birthday: Birthday | BirthdayWithOccurrence): birthday is BirthdayWithOccurrence {
  return 'age' in birthday;
}

export function BirthdayCard({ birthday }: BirthdayCardProps) {
  const age = hasAge(birthday) ? birthday.age : null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{birthday.name}</CardTitle>
        <CardDescription>
          Geburtstag: {formatBirthDate(birthday.birthDate)}
          {age !== null && ` • Alter: ${age}`}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
