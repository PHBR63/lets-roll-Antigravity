/**
 * ProtectedRoute Component
 * 
 * Componente de rota protegida que requer autenticação.
 * Redireciona para a página de login se o usuário não estiver autenticado.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

/**
 * ProtectedRoute
 * 
 * Envolve componentes que requerem autenticação.
 * Se não houver usuário logado, redireciona para /auth.
 * 
 * @param children - Componente filho a ser renderizado se autenticado
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth();

    // Mostrar loading enquanto verifica autenticação
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-900">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-400">Carregando...</p>
                </div>
            </div>
        );
    }

    // Se não está autenticado, redirecionar para login
    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // Se está autenticado, renderizar children
    return <>{children}</>;
};
