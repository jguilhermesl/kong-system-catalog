import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Selecione uma opção',
  className,
  containerClassName,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className={cn('relative', containerClassName)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full h-10 px-3 py-2 text-left bg-zinc-950 border border-gray-600 rounded-md',
          'text-gray-100 placeholder:text-white focus:outline-none focus:ring-2 focus:ring-primary',
          'flex items-center justify-between',
          className
        )}
      >
        <span className={cn(!selectedOption && 'text-gray-400')}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className={cn(
          'h-4 w-4 text-gray-400 transition-transform',
          isOpen && 'transform rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                'w-full px-3 py-2 text-left text-gray-100 hover:bg-zinc-800 transition-colors',
                value === option.value && 'bg-zinc-800 text-primary'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
