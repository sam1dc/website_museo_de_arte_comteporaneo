import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import LoginView from '../views/LoginView';
import DashboardContent from '../components/DashboardContent';
import UsuariosView from '../views/UsuariosView';
import GenerosView from '../views/GenerosView';
import ArtistasView from '../views/ArtistasView';
import ObrasView from '../views/ObrasView';
import CompradoresView from '../views/CompradoresView';
import FacturacionView from '../views/FacturacionView';
import ReportesView from '../views/ReportesView';

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
        <Route path="artistas" element={<ArtistasView />} />
        <Route path="obras" element={<ObrasView />} />
        <Route path="compradores" element={<CompradoresView />} />
        <Route path="facturacion" element={<FacturacionView />} />
        <Route path="reportes" element={<ReportesView />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
