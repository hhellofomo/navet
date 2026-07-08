import { Calendar as CalendarIcon } from 'lucide-react';

interface CalendarDateDisplayProps {
  textPrimary: string;
  iconBg: string;
  iconColor: string;
  dayName: string;
  monthName: string;
  dayNumber: number;
}

export function CalendarDateDisplay({
  textPrimary,
  iconBg,
  iconColor,
  dayName,
  monthName,
  dayNumber,
}: CalendarDateDisplayProps) {
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="min-w-0 flex-1 text-left">
        <span className={`font-semibold ${textPrimary} text-sm text-left`}>
          {dayName}, {monthName} {dayNumber}
        </span>
      </div>

      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBg} flex items-center justify-center ml-2`}
      >
        <CalendarIcon className={`w-5 h-5 ${iconColor}`} />
      </div>
    </div>
  );
}
