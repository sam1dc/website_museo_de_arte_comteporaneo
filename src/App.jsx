import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';

function AppContent() {
  const { user } = useAuth();
  return user ? <DashboardView /> : <LoginView />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
