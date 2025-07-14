import MainLayout from '@/layouts/MainLayout';

export default function MaritalStatusPage() {
  return (
    <MainLayout
      breadList={[
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/marital-status', label: 'Estados Civiles' },
      ]}
    >
      <h1 className='text-2xl font-bold'>Estados Civiles</h1>
      {/* Aquí irá la tabla/listado de estados civiles */}
    </MainLayout>
  );
}
