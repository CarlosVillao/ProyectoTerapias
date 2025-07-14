import MainLayout from '@/layouts/MainLayout';

export default function ExpensesPage() {
  return (
    <MainLayout
      breadList={[
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/expenses', label: 'Gastos' },
      ]}
    >
      <h1 className='text-2xl font-bold'>Gastos</h1>
      {/* Aquí irá la tabla/listado de gastos */}
    </MainLayout>
  );
}
