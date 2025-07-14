import { useState } from 'react';
import { recuperarPasswordRequest } from '@/services/authService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<'form'>) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      await recuperarPasswordRequest(email);
      setMessage('Si el correo existe, recibirás instrucciones para recuperar tu contraseña.');
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const errorObj = err as { response?: { data?: { detail?: string } } };
        setError(errorObj.response?.data?.detail || 'Error al solicitar recuperación.');
      } else {
        setError('Error al solicitar recuperación.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={`flex flex-col gap-6 ${className ?? ''}`} onSubmit={handleSubmit} {...props}>
      <Input
        type='email'
        name='email'
        placeholder='Correo electrónico'
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <Button type='submit' disabled={isLoading}>
        {isLoading ? 'Enviando...' : 'Recuperar contraseña'}
      </Button>
      {message && <div className='text-green-600 text-sm'>{message}</div>}
      {error && <div className='text-red-600 text-sm'>{error}</div>}
    </form>
  );
}
