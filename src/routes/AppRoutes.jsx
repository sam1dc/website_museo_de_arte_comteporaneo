import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import PublicLayout from '../layouts/PublicLayout';
import LoginView from '../views/LoginView';
import DashboardContent from '../components/DashboardContent';
import UsuariosView from '../views/UsuariosView';
import GenerosView from '../views/GenerosView';
import ArtistasView from '../views/ArtistasView';
import ObrasView from '../views/ObrasView';
import CompradoresView from '../views/CompradoresView';
import FacturacionView from '../views/FacturacionView';
import SolicitudesCompraView from '../views/SolicitudesCompraView';
import ReportesView from '../views/ReportesView';
import HomeView from '../views/HomeView';
import CatalogoView from '../views/CatalogoView';
import DetalleObraView from '../views/DetalleObraView';
import ArtistaPerfilView from '../views/ArtistaPerfilView';
import CheckoutView from '../views/CheckoutView';
import ConfirmacionCompraView from '../views/ConfirmacionCompraView';
import MisComprasView from '../views/MisComprasView';

// Componente para redirección inteligente
const HomeRedirect = () => {
  const { user } = useAuth();
  
  if (user && (user.tipo === 'admin' || user.tipo === 'empleado')) {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/museo-de-arte-contemporaneo" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirección por defecto */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Login Unificado */}
      <Route path="/login" element={<LoginView />} />

      {/* Panel Administrativo */}
      <Route path="/admin" element={
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
        <Route path="solicitudes-compra" element={<SolicitudesCompraView />} />
        <Route path="facturacion" element={<FacturacionView />} />
        <Route path="reportes" element={<ReportesView />} />
      </Route>

      {/* Sitio Público */}
      <Route path="/museo-de-arte-contemporaneo" element={<PublicLayout />}>
        <Route index element={<HomeView />} />
        <Route path="catalogo" element={<CatalogoView />} />
        <Route path="obra/:id" element={<DetalleObraView />} />
        <Route path="artista/:id" element={<ArtistaPerfilView />} />
        <Route path="checkout/:id" element={<CheckoutView />} />
        <Route path="confirmacion" element={<ConfirmacionCompraView />} />
        <Route path="mis-compras" element={<MisComprasView />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
