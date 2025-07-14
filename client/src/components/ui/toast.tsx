import { useEffect } from 'react';

export function Toast({
  message,
  type = 'info',
  onClose,
}: {
  message: string;
  type?: 'info' | 'success' | 'error';
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  let color = 'bg-gray-800';
  if (type === 'success') color = 'bg-green-600';
  if (type === 'error') color = 'bg-red-600';

  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded text-white shadow-lg ${color}`}>
      {message}
    </div>
  );
}
