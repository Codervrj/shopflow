import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import AdminLoginPage from '../../pages/admin/AdminLoginPage';

export default function AdminGuard() {
  const user = useAuthStore(s => s.user);
  if (!user) return <AdminLoginPage />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}
