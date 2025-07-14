import * as React from 'react';
import { BookOpen, Command, Map, Settings2, SquareTerminal } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ModeToggle } from './mode-toggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRolesMenusV2 } from '@/hooks/useRolesMenusV2';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user: sessionUser } = useAuth();
  const user = {
    name: sessionUser?.email?.split('@')[0] || 'Usuario',
    email: sessionUser?.email || 'correo@ejemplo.com',
    avatar: '/avatars/admin.jpg',
  };
  // Agrupar menús por categorías
  const data = {
    user,
    navMain: [
      {
        title: 'Dashboard',
        url: '/admin',
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: 'Clinica',
        icon: BookOpen,
        isActive: false,
        url: '',
        items: [
          { title: 'Clientes', url: '/admin/clients' },
          { title: 'Personas', url: '/admin/persons' },
          { title: 'Pacientes', url: '/admin/patients' },
          { title: 'Sesiones', url: '/admin/sessions' },
        ],
      },
      {
        title: 'Catálogos',
        icon: Map,
        isActive: false,
        url: '',
        items: [
          { title: 'Productos', url: '/admin/products' },
          { title: 'Géneros', url: '/admin/genres' },
          { title: 'Estados Civiles', url: '/admin/marital-status' },
        ],
      },
      {
        title: 'Facturación',
        icon: Settings2,
        isActive: false,
        url: '',
        items: [
          { title: 'Facturas', url: '/admin/invoices' },
          { title: 'Detalles de Factura', url: '/admin/invoice-details' },
          { title: 'Pagos de Factura', url: '/admin/invoice-payments' },
          { title: 'Métodos de Pago', url: '/admin/payment-methods' },
        ],
      },

      {
        title: 'Gastos',
        icon: BookOpen,
        isActive: false,
        url: '',
        items: [
          { title: 'Tipos de Gasto', url: '/admin/expense-types' },
          { title: 'Gastos', url: '/admin/expenses' },
        ],
      },
    ],
    navSecondary: [],
    projects: [],
  };
  const { roles, loading } = useRolesMenusV2();
  const [selectedRole, setSelectedRole] = React.useState('');

  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='#'>
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <Command className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>Clinica</span>
                  <span className='truncate text-xs'>Ing de Software</span>
                </div>
                <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                  <ModeToggle />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {/* Roles */}
        <Select
          value={selectedRole}
          onValueChange={setSelectedRole}
          disabled={loading || !roles.length}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder={loading ? 'Cargando roles...' : 'Selecciona un rol'} />
          </SelectTrigger>
          <SelectContent>
            {roles.map(r => (
              <SelectItem key={r.rol_name} value={r.rol_name}>
                {r.rol_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
