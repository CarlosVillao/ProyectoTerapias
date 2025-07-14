import MainLayout from '@/layouts/MainLayout';

export default function ExpenseTypesPage() {
  return (
    <MainLayout
      breadList={[
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/expense-types', label: 'Tipos de Gasto' },
      ]}
    >
      <h1 className='text-2xl font-bold'>Tipos de Gasto</h1>
      {/* Aquí irá la tabla/listado de tipos de gasto */}
    </MainLayout>
  );
}
