/**
 * Types - Interfaces TypeScript compartilhadas
 * 
 * Este arquivo centraliza as interfaces e tipos utilizados
 * em todo o backend, garantindo type-safety.
 */

/**
 * Interface: UserPayload
 * Representa os dados de um usuário após autenticação (JWT payload)
 */
export interface UserPayload {
    id: string;
    email: string;
    username: string;
}

/**
 * Interface: CreateUserDTO
 * Data Transfer Object para criação de usuário
 */
export interface CreateUserDTO {
    email: string;
    username: string;
    password: string;
    timezone?: string;
}

/**
 * Interface: LoginDTO
 * Data Transfer Object para login
 */
export interface LoginDTO {
    email: string;
    password: string;
}

/**
 * Interface: AuthResponse
 * Resposta de autenticação (login/register)
 */
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        username: string;
        avatar?: string;
    };
}
