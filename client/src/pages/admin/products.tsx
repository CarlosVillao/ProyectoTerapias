import MainLayout from '@/layouts/MainLayout';
import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductForm } from '@/components/products/ProductForm';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
} from '@/services/adminProductService';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

export default function ProductsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const { products, loading, error } = useProducts(refresh);

  const handleCreate = async (data: Partial<Product>) => {
    try {
      await createProduct(data);
      setShowForm(false);
      setToast({ message: 'Producto creado', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al crear producto', type: 'error' });
    }
  };

  const handleEdit = async (data: Partial<Product>) => {
    if (!editProduct) return;
    try {
      await updateProduct(editProduct.pro_id, data);
      setEditProduct(null);
      setToast({ message: 'Producto actualizado', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al actualizar producto', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteProduct(confirmDelete.pro_id);
      setToast({ message: 'Producto eliminado', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al eliminar producto', type: 'error' });
    }
    setConfirmDelete(null);
  };

  return (
    <MainLayout
      breadList={[
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/products', label: 'Productos' },
      ]}
    >
      <h1 className='text-2xl font-bold mb-4'>Productos</h1>
      <div className='flex gap-2 mb-4'>
        <Button onClick={() => setShowForm(true)} className='bg-primary text-white'>
          Nuevo Producto
        </Button>
        <Button variant='outline' onClick={() => setRefresh(r => r + 1)}>
          Recargar
        </Button>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <h2 className='text-lg font-semibold mb-2'>Nuevo Producto</h2>
        <ProductForm onSubmit={handleCreate} loading={loading} />
      </Modal>

      <Modal open={!!editProduct} onClose={() => setEditProduct(null)}>
        <h2 className='text-lg font-semibold mb-2'>Editar Producto</h2>
        <ProductForm initial={editProduct ?? {}} onSubmit={handleEdit} loading={loading} />
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <div className='text-center'>
          <p>
            ¿Seguro que deseas eliminar el producto <b>{confirmDelete?.pro_name}</b>?
          </p>
          <div className='flex gap-2 justify-center mt-4'>
            <Button onClick={handleDelete} className='bg-red-600 text-white'>
              Eliminar
            </Button>
            <Button variant='outline' onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {loading && <div>Cargando productos...</div>}
      {error && <div className='text-red-500'>{error}</div>}
      {!loading && !error && (
        <div style={{ maxWidth: '100vw', overflowX: 'auto' }} className='w-full'>
          <div style={{ minWidth: 1200 }}>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted'>
                  <TableHead>ID</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Sesiones</TableHead>
                  <TableHead>Duración (días)</TableHead>
                  <TableHead>Imagen</TableHead>
                  <TableHead>ID Tipo Terapia</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead>Modificado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: Product) => (
                  <TableRow key={product.pro_id}>
                    <TableCell>{product.pro_id}</TableCell>
                    <TableCell>{product.pro_code}</TableCell>
                    <TableCell>{product.pro_name}</TableCell>
                    <TableCell>{product.pro_description}</TableCell>
                    <TableCell>{product.pro_price}</TableCell>
                    <TableCell>{product.pro_total_sessions}</TableCell>
                    <TableCell>{product.pro_duration_days}</TableCell>
                    <TableCell>
                      {product.pro_image_url ? (
                        <img
                          src={product.pro_image_url}
                          alt={product.pro_name}
                          style={{ maxWidth: 60, maxHeight: 40, objectFit: 'cover' }}
                        />
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{product.pro_therapy_type_id}</TableCell>
                    <TableCell>
                      <Badge color={product.pro_state ? 'success' : 'danger'}>
                        {product.pro_state ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.date_created ? new Date(product.date_created).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell>
                      {product.date_modified
                        ? new Date(product.date_modified).toLocaleString()
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <div className='flex gap-2'>
                        <Button size='sm' variant='outline' onClick={() => setEditProduct(product)}>
                          Editar
                        </Button>
                        <Button
                          size='sm'
                          variant='destructive'
                          onClick={() => setConfirmDelete(product)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
