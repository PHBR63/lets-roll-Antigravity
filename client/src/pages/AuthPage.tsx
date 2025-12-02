/**
 * Auth Page
 * 
 * Página de autenticação com toggle entre Login e Cadastro.
 * Estética gamer com card glassmorphism e animações suaves.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';

/**
 * AuthPage
 * 
 * Renderiza formulário de login ou cadastro baseado no estado.
 * Após autenticação bem-sucedida, redireciona para o dashboard.
 */
export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    /**
     * handleSubmit
     * 
     * Processa o submit do formulário (login ou cadastro).
     * Exibe erro se houver falha na autenticação.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                if (!username) {
                    setError('Username é obrigatório');
                    setIsLoading(false);
                    return;
                }
                await register(email, username, password);
            }

            // Redirecionar para dashboard
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao autenticar. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900/20">
            <Card className="w-full max-w-md">
                {/* Logo/Título */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-neon-purple mb-2">
                        Let's Roll
                    </h1>
                    <p className="text-gray-400">
                        Sua plataforma de RPG de mesa online
                    </p>
                </div>

                {/* Toggle Login/Cadastro */}
                <div className="flex gap-2 mb-6 p-1 bg-dark-700 rounded-lg">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 px-4 rounded-md transition-all ${isLogin
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 px-4 rounded-md transition-all ${!isLogin
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        Cadastro
                    </button>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="seu@email.com"
                    />

                    {!isLogin && (
                        <Input
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="seu_usuario"
                        />
                    )}

                    <Input
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                    />

                    {error && (
                        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        isLoading={isLoading}
                    >
                        {isLogin ? 'Entrar' : 'Criar Conta'}
                    </Button>
                </form>

                {/* Rodapé */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                        {isLogin ? 'Cadastre-se' : 'Faça login'}
                    </button>
                </p>
            </Card>
        </div>
    );
};
