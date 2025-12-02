/**
 * Dashboard Page
 * 
 * Página principal após login.
 * Mostra mensagem de boas-vindas e opção de logout (temporário).
 */

import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

/**
 * DashboardPage
 * 
 * Área logada da aplicação.
 * Futuramente exibirá lista de campanhas.
 */
export const DashboardPage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-dark-900 p-8">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-neon-purple mb-2">
                                Bem-vindo, {user?.username}!
                            </h1>
                            <p className="text-gray-400">
                                Dashboard - Let's Roll
                            </p>
                        </div>
                        <Button variant="secondary" onClick={logout}>
                            Sair
                        </Button>
                    </div>

                    <div className="p-8 bg-dark-700/50 rounded-lg border border-dark-600 text-center">
                        <p className="text-gray-300 mb-4">
                            🎲 Sua plataforma de RPG está pronta!
                        </p>
                        <p className="text-gray-500 text-sm">
                            Em breve: Lista de campanhas, criação de campanhas e muito mais.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};
