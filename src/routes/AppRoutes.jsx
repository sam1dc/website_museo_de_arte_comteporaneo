import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import LoginView from '../views/LoginView';
import DashboardContent from '../components/DashboardContent';
import UsuariosView from '../views/UsuariosView';
import GenerosView from '../views/GenerosView';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardContent />} />
        <Route path="usuarios" element={<UsuariosView />} />
        <Route path="generos" element={<GenerosView />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
