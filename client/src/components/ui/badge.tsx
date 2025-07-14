import { cn } from '@/lib/utils';

export function Badge({
  children,
  color = 'default',
  className = '',
}: {
  children: React.ReactNode;
  color?: 'default' | 'success' | 'danger';
  className?: string;
}) {
  let colorClass = '';
  switch (color) {
    case 'success':
      colorClass = 'bg-green-600 text-white';
      break;
    case 'danger':
      colorClass = 'bg-red-600 text-white';
      break;
    default:
      colorClass = 'bg-gray-600 text-white';
  }
  return (
    <span className={cn('px-2 py-0.5 rounded text-xs font-semibold', colorClass, className)}>
      {children}
    </span>
  );
}
