import { Routes, Route } from 'react-router-dom';
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
import ReportesView from '../views/ReportesView';
import CatalogoView from '../views/CatalogoView';
import DetalleObraView from '../views/DetalleObraView';
import ArtistaPerfilView from '../views/ArtistaPerfilView';
import CheckoutView from '../views/CheckoutView';
import ConfirmacionCompraView from '../views/ConfirmacionCompraView';
import MisComprasView from '../views/MisComprasView';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login Unificado */}
      <Route path="/login" element={<LoginView />} />

      {/* Panel Administrativo */}
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

      {/* Sitio Público */}
      <Route path="/museo-de-arte-contemporaneo" element={<PublicLayout />}>
        <Route index element={<CatalogoView />} />
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
