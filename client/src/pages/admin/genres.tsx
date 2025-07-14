import MainLayout from '@/layouts/MainLayout';
import { useState } from 'react';
import { useGenres } from '@/hooks/useGenres';
import { GenreForm } from '@/components/genres/GenreForm';
import { createGenre, updateGenre, deleteGenre, type Genre } from '@/services/adminGenreService';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

export default function GenresPage() {
  const [showForm, setShowForm] = useState(false);
  const [editGenre, setEditGenre] = useState<Genre | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Genre | null>(null);
  const { genres, loading, error } = useGenres(refresh);

  const handleCreate = async (data: Partial<Genre>) => {
    try {
      await createGenre(data);
      setShowForm(false);
      setToast({ message: 'Género creado', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al crear género', type: 'error' });
    }
  };

  const handleEdit = async (data: Partial<Genre>) => {
    if (!editGenre) return;
    try {
      await updateGenre(editGenre.gen_id, data);
      setEditGenre(null);
      setToast({ message: 'Género actualizado', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al actualizar género', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteGenre(confirmDelete.gen_id);
      setToast({ message: 'Género eliminado', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al eliminar género', type: 'error' });
    }
    setConfirmDelete(null);
  };

  return (
    <MainLayout
      breadList={[
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/genres', label: 'Géneros' },
      ]}
    >
      <h1 className='text-2xl font-bold mb-4'>Géneros</h1>
      <div className='flex gap-2 mb-4'>
        <Button onClick={() => setShowForm(true)} className='bg-primary text-white'>
          Nuevo Género
        </Button>
        <Button variant='outline' onClick={() => setRefresh(r => r + 1)}>
          Recargar
        </Button>
      </div>
      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <h2 className='text-lg font-semibold mb-2'>Nuevo Género</h2>
        <GenreForm onSubmit={handleCreate} loading={loading} />
      </Modal>
      <Modal open={!!editGenre} onClose={() => setEditGenre(null)}>
        <h2 className='text-lg font-semibold mb-2'>Editar Género</h2>
        <GenreForm initial={editGenre ?? {}} onSubmit={handleEdit} loading={loading} />
      </Modal>
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <div className='text-center'>
          <p>
            ¿Seguro que deseas eliminar el género <b>{confirmDelete?.gen_name}</b>?
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
      {loading && <div>Cargando géneros...</div>}
      {error && <div className='text-red-500'>{error}</div>}
      {!loading && !error && (
        <div style={{ maxWidth: '80vw', overflowX: 'auto' }} className='w-full'>
          <div style={{ minWidth: 600 }}>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted'>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {genres.map((genre: Genre) => (
                  <TableRow key={genre.gen_id}>
                    <TableCell>{genre.gen_id}</TableCell>
                    <TableCell>{genre.gen_name}</TableCell>
                    <TableCell>
                      {genre.date_created ? new Date(genre.date_created).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell>
                      <div className='flex gap-2'>
                        <Button size='sm' variant='outline' onClick={() => setEditGenre(genre)}>
                          Editar
                        </Button>
                        <Button
                          size='sm'
                          variant='destructive'
                          onClick={() => setConfirmDelete(genre)}
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
