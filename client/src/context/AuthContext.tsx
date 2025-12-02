/**
 * Auth Context
 * 
 * Gerencia o estado de autenticação da aplicação.
 * Fornece funções para login, logout e verificação de usuário logado.
 * 
 * Persiste o token JWT no localStorage e verifica automaticamente
 * ao carregar a aplicação se há um usuário logado.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// URL base da API (variável de ambiente ou localhost)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Interface: User
 * Representa os dados do usuário autenticado
 */
interface User {
    id: string;
    email: string;
    username: string;
    avatar?: string;
}

/**
 * Interface: AuthContextType
 * Define os métodos e estado do contexto de autenticação
 */
interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider
 * 
 * Provedor do contexto de autenticação.
 * Envolve a aplicação para fornecer estado e funções de auth.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Verificar Token Salvo
     * 
     * Ao carregar a aplicação, verifica se há um token no localStorage.
     * Se houver, tenta buscar os dados do usuário (/api/auth/me).
     */
    useEffect(() => {
        const checkAuth = async () => {
            const savedToken = localStorage.getItem('token');

            if (savedToken) {
                try {
                    // Configurar header de autorização
                    const response = await axios.get(`${API_URL}/api/auth/me`, {
                        headers: { Authorization: `Bearer ${savedToken}` }
                    });

                    setUser(response.data);
                    setToken(savedToken);
                } catch (error) {
                    // Token inválido ou expirado, remover do localStorage
                    localStorage.removeItem('token');
                }
            }

            setIsLoading(false);
        };

        checkAuth();
    }, []);

    /**
     * Login
     * 
     * Faz login do usuário com email e senha.
     * Salva o token no localStorage e atualiza o estado.
     * 
     * @throws Error se as credenciais forem inválidas
     */
    const login = async (email: string, password: string) => {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password
        });

        const { token: newToken, user: userData } = response.data;

        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    /**
     * Register
     * 
     * Registra um novo usuário na plataforma.
     * Automaticamente faz login após o registro.
     * 
     * @throws Error se o email/username já existir
     */
    const register = async (email: string, username: string, password: string) => {
        const response = await axios.post(`${API_URL}/api/auth/register`, {
            email,
            username,
            password
        });

        const { token: newToken, user: userData } = response.data;

        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    /**
     * Logout
     * 
     * Remove o token do localStorage e limpa o estado.
     */
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * useAuth Hook
 * 
 * Hook customizado para acessar o contexto de autenticação.
 * Deve ser usado dentro de um componente envolvido por AuthProvider.
 * 
 * @returns Contexto de autenticação
 * @throws Error se usado fora do AuthProvider
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }

    return context;
};
