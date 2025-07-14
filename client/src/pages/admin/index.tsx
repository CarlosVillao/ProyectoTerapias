import MainLayout from '@/layouts/MainLayout';

export default function AdminDashboard() {
  return (
    <MainLayout breadList={[{ href: '/admin', label: 'Dashboard' }]}>
      <h1 className='text-2xl font-bold'>Dashboard Administración</h1>
      <p className='text-muted-foreground mt-2'>
        Bienvenido al panel de administración. Selecciona una sección del menú para comenzar.
      </p>
    </MainLayout>
  );
}
