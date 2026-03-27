import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export interface AlertProps {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  showIcon?: boolean;
}

const alertVariants = {
  default: 'bg-blue-50 text-blue-900 border-blue-200',
  destructive: 'bg-red-50 text-red-900 border-red-200',
  success: 'bg-green-50 text-green-900 border-green-200',
  warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
};

const alertIcons = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle,
  warning: AlertCircle,
};

export function Alert({ 
  variant = 'default', 
  children, 
  className, 
  onClose,
  showIcon = true 
}: AlertProps) {
  const Icon = alertIcons[variant];

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 rounded-lg border p-4',
        alertVariants[variant],
        className
      )}
    >
      {showIcon && <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />}
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function AlertTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h5 className={cn('font-semibold leading-none tracking-tight', className)}>
      {children}
    </h5>
  );
}

export function AlertDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('text-sm [&_p]:leading-relaxed', className)}>
      {children}
    </div>
  );
}
