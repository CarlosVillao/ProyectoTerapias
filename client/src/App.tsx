import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import ForgotPasswordPage from './pages/ForgotPassword';
import { useAuth } from './hooks/useAuth';
import DashboardPage from './pages/Dashboard';
import AdminDashboard from './pages/admin';
import ClientsPage from './pages/admin/clients';
import PersonsPage from './pages/admin/persons';
import PatientsPage from './pages/admin/patients';
import ProductsPage from './pages/admin/products';
import GenresPage from './pages/admin/genres';
import MaritalStatusPage from './pages/admin/marital-status';
import PaymentMethodsPage from './pages/admin/payment-methods';
import InvoicesPage from './pages/admin/invoices';
import InvoiceDetailsPage from './pages/admin/invoice-details';
import InvoicePaymentsPage from './pages/admin/invoice-payments';
import ExpenseTypesPage from './pages/admin/expense-types';
import ExpensesPage from './pages/admin/expenses';
import SessionsPage from './pages/admin/sessions';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Mejor UX que null
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />; // Cambio aquí
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route
          path='/login'
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />

        {/* Ruta raíz - redirige al dashboard */}
        <Route path='/' element={<Navigate to='/dashboard' replace />} />

        {/* Dashboard */}
        <Route
          path='/dashboard'
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />

        {/* Rutas de administración */}
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/admin/clients' element={<ClientsPage />} />
        <Route
          path='/admin/persons'
          element={
            <RequireAuth>
              <PersonsPage />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/patients'
          element={
            <RequireAuth>
              <PatientsPage />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/products'
          element={
            <RequireAuth>
              <ProductsPage />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/genres'
          element={
            <RequireAuth>
              <GenresPage />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/marital-status'
          element={
            <RequireAuth>
              <MaritalStatusPage />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/payment-methods'
          element={
            <RequireAuth>
              <PaymentMethodsPage />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/invoices'
          element={
            <RequireAuth>
              <InvoicesPage />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/invoice-details'
          element={
            <RequireAuth>
              <InvoiceDetailsPage />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/invoice-payments'
          element={
            <RequireAuth>
              <InvoicePaymentsPage />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/expense-types'
          element={
            <RequireAuth>
              <ExpenseTypesPage />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/expenses'
          element={
            <RequireAuth>
              <ExpensesPage />
            </RequireAuth>
          }
        />

        {/* Rutas de sesiones */}
        <Route
          path='/admin/sessions'
          element={
            <RequireAuth>
              <SessionsPage />
            </RequireAuth>
          }
        />

        {/* Ruta catch-all para 404 */}
        <Route path='*' element={<Navigate to='/dashboard' replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
