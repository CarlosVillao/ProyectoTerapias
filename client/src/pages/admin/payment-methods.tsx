import MainLayout from '@/layouts/MainLayout';

export default function PaymentMethodsPage() {
  return (
    <MainLayout
      breadList={[
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/payment-methods', label: 'Métodos de Pago' },
      ]}
    >
      <h1 className='text-2xl font-bold'>Métodos de Pago</h1>
      {/* Aquí irá la tabla/listado de métodos de pago */}
    </MainLayout>
  );
}
