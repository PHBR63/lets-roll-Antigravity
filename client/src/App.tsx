/**
 * App Component
 * 
 * Componente raiz da aplicação.
 * Configura o React Router e envolve a aplicação com o AuthProvider.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota pública */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Placeholder: Página da Campanha */}
          <Route
            path="/campaigns/:id"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-navy-950 flex items-center justify-center">
                  <p className="text-white text-xl">Página da Campanha (em desenvolvimento)</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Fallback para rotas não encontradas */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
