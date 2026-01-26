'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateRangePickerProps {
  minDate: Date;
  maxDate: Date;
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  minDate,
  maxDate,
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');

  // Preset options
  const presets = [
    {
      label: 'Últimos 7 días',
      value: 'last-7',
      getRange: () => {
        const end = maxDate;
        const start = new Date(maxDate);
        start.setDate(start.getDate() - 6);
        return { from: start, to: end };
      },
    },
    {
      label: 'Últimos 14 días',
      value: 'last-14',
      getRange: () => {
        const end = maxDate;
        const start = new Date(maxDate);
        start.setDate(start.getDate() - 13);
        return { from: start, to: end };
      },
    },
    {
      label: 'Últimos 30 días',
      value: 'last-30',
      getRange: () => {
        const end = maxDate;
        const start = new Date(maxDate);
        start.setDate(start.getDate() - 29);
        return { from: start, to: end };
      },
    },
    {
      label: 'Todo el período',
      value: 'all',
      getRange: () => ({ from: minDate, to: maxDate }),
    },
    {
      label: 'Personalizado',
      value: 'custom',
      getRange: () => value || { from: minDate, to: maxDate },
    },
  ];

  const handlePresetChange = (presetValue: string) => {
    setSelectedPreset(presetValue);
    const preset = presets.find((p) => p.value === presetValue);
    if (preset && presetValue !== 'custom') {
      const range = preset.getRange();
      onChange(range);
      setIsOpen(false);
    }
  };

  const handleReset = () => {
    onChange({ from: minDate, to: maxDate });
    setSelectedPreset('all');
  };

  const formatRange = () => {
    if (!value?.from) return 'Selecciona un período';
    
    if (!value.to) {
      return format(value.from, 'dd/MM/yyyy', { locale: es });
    }

    return `${format(value.from, 'dd/MM/yyyy', { locale: es })} - ${format(
      value.to,
      'dd/MM/yyyy',
      { locale: es }
    )}`;
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Sidebar with presets */}
            <div className="border-r p-3 space-y-2 min-w-[140px]">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                PERÍODO
              </div>
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetChange(preset.value)}
                  className={cn(
                    'w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors',
                    selectedPreset === preset.value && 'bg-accent font-medium'
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Calendar */}
            <div className="p-3">
              {selectedPreset === 'custom' && (
                <>
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={value?.from || minDate}
                    selected={value}
                    onSelect={onChange}
                    numberOfMonths={2}
                    locale={es}
                    disabled={(date) =>
                      date < minDate || date > maxDate
                    }
                  />
                  <div className="flex justify-between items-center pt-3 border-t mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="text-xs"
                    >
                      Restablecer
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-xs"
                    >
                      Aplicar
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}