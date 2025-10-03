import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: boolean;
  helperText?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({ 
  className, 
  label, 
  error = false, 
  helperText,
  onCheckedChange,
  id,
  ...props 
}: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex items-start space-x-2">
      <div className="relative">
        <input
          type="checkbox"
          id={checkboxId}
          className={cn(
            'peer h-4 w-4 shrink-0 rounded border border-gray-300 text-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
            error && 'border-red-500 focus:ring-red-500/20',
            className
          )}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        <Check 
          className={cn(
            'absolute left-0.5 top-0.5 h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity',
            error && 'text-red-600'
          )}
        />
      </div>
      {(label || helperText) && (
        <div className="flex-1">
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'text-sm font-medium leading-none cursor-pointer text-gray-900',
                error && 'text-red-600',
                props.disabled && 'cursor-not-allowed opacity-70'
              )}
            >
              {label}
            </label>
          )}
          {helperText && (
            <p className={cn(
              'text-xs mt-1',
              error ? 'text-red-600' : 'text-gray-500'
            )}>
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
