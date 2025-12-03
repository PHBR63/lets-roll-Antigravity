/**
 * App Component
 * 
 * Componente raiz da aplicação.
 * Configura o React Router e envolve a aplicação com o AuthProvider.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { CampaignDetailsPage } from './pages/CampaignDetailsPage';
import { CharacterCreationPage } from './pages/CharacterCreationPage';
import { CharacterSheetPage } from './pages/CharacterSheetPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CampaignWizard } from './components/CampaignWizard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
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

            {/* Criador de Campanha */}
            <Route
              path="/campaigns/new"
              element={
                <ProtectedRoute>
                  <CampaignWizard />
                </ProtectedRoute>
              }
            />

            {/* Página da Campanha */}
            <Route
              path="/campaigns/:id"
              element={
                <ProtectedRoute>
                  <CampaignDetailsPage />
                </ProtectedRoute>
              }
            />

            {/* Criação de Personagem */}
            <Route
              path="/campaigns/:campaignId/create-character"
              element={
                <ProtectedRoute>
                  <CharacterCreationPage />
                </ProtectedRoute>
              }
            />

            {/* Ficha de Personagem */}
            <Route
              path="/characters/:id"
              element={
                <ProtectedRoute>
                  <CharacterSheetPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback para rotas não encontradas */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
