import { useState } from 'react';
import { type InvoiceDetail } from '@/services/adminInvoiceDetailService';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useInvoices } from '@/hooks/useInvoices';
import { useProducts } from '@/hooks/useProducts';

export function InvoiceDetailForm({
  initial = {},
  onSubmit,
  loading,
}: {
  initial?: Partial<InvoiceDetail>;
  onSubmit: (data: Partial<InvoiceDetail>) => void;
  loading?: boolean;
}) {
  const [form, setForm] = useState<Partial<InvoiceDetail>>(initial);
  const { invoices, loading: loadingInvoices } = useInvoices();
  const { products, loading: loadingProducts } = useProducts();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
      <Select
        value={form.ind_invoice_id ? String(form.ind_invoice_id) : ''}
        onValueChange={val => setForm(f => ({ ...f, ind_invoice_id: Number(val) }))}
        required
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={loadingInvoices ? 'Cargando...' : 'Selecciona factura'} />
        </SelectTrigger>
        <SelectContent>
          {invoices.map(inv => (
            <SelectItem key={inv.inv_id} value={String(inv.inv_id)}>
              {inv.inv_id} - {inv.inv_date} - {inv.inv_patient_id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={form.ind_product_id ? String(form.ind_product_id) : ''}
        onValueChange={val => setForm(f => ({ ...f, ind_product_id: Number(val) }))}
        required
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={loadingProducts ? 'Cargando...' : 'Selecciona producto'} />
        </SelectTrigger>
        <SelectContent>
          {products.map(prod => (
            <SelectItem key={prod.pro_id} value={String(prod.pro_id)}>
              {prod.pro_name} ({prod.pro_code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input
        name='ind_quantity'
        type='number'
        placeholder='Cantidad'
        value={form.ind_quantity ?? ''}
        onChange={handleChange}
        required
        className='input'
      />
      <input
        name='ind_unit_price'
        type='number'
        placeholder='Precio Unitario'
        value={form.ind_unit_price ?? ''}
        onChange={handleChange}
        required
        className='input'
      />
      <input
        name='ind_total'
        type='number'
        placeholder='Total'
        value={form.ind_total ?? ''}
        onChange={handleChange}
        required
        className='input'
      />
      <label className='flex items-center gap-2'>
        <input
          name='ind_state'
          type='checkbox'
          checked={form.ind_state ?? true}
          onChange={e => setForm(f => ({ ...f, ind_state: e.target.checked }))}
        />
        Activo
      </label>
      <Button type='submit' disabled={loading} className='bg-primary text-white'>
        {loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
}
