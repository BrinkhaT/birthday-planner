import { Birthday } from '@/types/birthday';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatBirthDate } from '@/lib/utils';

interface BirthdayCardProps {
  birthday: Birthday;
}

export function BirthdayCard({ birthday }: BirthdayCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{birthday.name}</CardTitle>
        <CardDescription>
          Birthday: {formatBirthDate(birthday.birthDate)}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
