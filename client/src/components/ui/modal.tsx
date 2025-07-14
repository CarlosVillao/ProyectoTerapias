import * as React from 'react';

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white dark:bg-zinc-900 rounded shadow-lg p-6 min-w-[320px] max-w-lg w-full relative'>
        <button
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white'
          onClick={onClose}
          aria-label='Cerrar'
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
