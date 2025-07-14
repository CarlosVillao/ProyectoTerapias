import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import type { AxiosError } from 'axios';
// Type guard para AxiosError con estructura esperada
function isAxiosErrorWithDetail(error: unknown): error is AxiosError<{ detail: string }> {
  if (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    Boolean((error as AxiosError).isAxiosError) &&
    'response' in error &&
    typeof (error as AxiosError).response === 'object' &&
    (error as AxiosError).response !== null
  ) {
    const response = (error as AxiosError).response;
    if (
      response &&
      'data' in response &&
      typeof response.data === 'object' &&
      response.data !== null &&
      'detail' in response.data
    ) {
      return true;
    }
  }
  return false;
}
import { Link } from 'react-router';

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const { login, isLoading, error: contextError } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    // Simple regex for email validation
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    setError(null);
    // Obtener los valores directamente de los inputs
    const email = (e.currentTarget.email?.value || '').trim();
    const password = (e.currentTarget.password?.value || '').trim();

    if (!validateEmail(email)) {
      setError('El correo electrónico no es válido');
      return;
    }
    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      // Enviar como objeto plano para que el servicio use JSON
      await login({ email, password });
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (!token || !user) {
        setError('Credenciales inválidas');
      }
    } catch (err: unknown) {
      // Mostrar siempre el mensaje de error, sea string, Error o respuesta del backend
      if (typeof err === 'string') {
        setError(err);
      } else if (isAxiosErrorWithDetail(err)) {
        setError(err.response!.data.detail);
      } else if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError('Error de autenticación');
      }
    }
  };

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={handleSubmit}
      autoComplete='off'
      action='#'
      method='post'
    >
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>Inicia sesión en tu cuenta</h1>
        <p className='text-muted-foreground text-sm text-balance'>
          Ingresa tu correo electrónico a continuación para iniciar sesión en tu cuenta
        </p>
      </div>
      <div className='grid gap-6'>
        <div className='grid gap-3'>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' name='email' type='email' placeholder='m@example.com' required />
        </div>
        <div className='grid gap-3'>
          <div className='flex items-center'>
            <Label htmlFor='password'>Password</Label>
            <Link
              to='/forgot-password'
              className='ml-auto text-sm underline-offset-4 hover:underline'
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input id='password' name='password' type='password' required />
        </div>
        {(error || contextError) && (
          <div className='text-red-500 text-sm text-center'>{error || contextError}</div>
        )}
        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
        </Button>
      </div>
    </form>
  );
}
