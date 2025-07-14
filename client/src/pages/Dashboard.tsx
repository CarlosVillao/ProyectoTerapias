import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user, token, error } = useAuth();
  return (
    <MainLayout breadList={[{ href: '/', label: 'Dashboard' }]}>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <div className='mt-4 p-2 bg-muted rounded'>
        <strong>Estado de autenticación:</strong>
        <ul className='text-sm mt-2'>
          <li>
            <b>isAuthenticated:</b> {String(isAuthenticated)}
          </li>
          <li>
            <b>isLoading:</b> {String(isLoading)}
          </li>
          <li>
            <b>user:</b> {user ? JSON.stringify(user) : 'null'}
          </li>
          <li>
            <b>token:</b> {token || 'null'}
          </li>
          <li>
            <b>error:</b> {error || 'Sin error'}
          </li>
        </ul>
      </div>
      {/* Additional dashboard content can be added here */}
    </MainLayout>
  );
}
