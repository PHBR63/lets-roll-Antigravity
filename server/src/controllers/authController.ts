/**
 * Auth Controller
 * 
 * Contém a lógica de negócio para autenticação de usuários.
 * Responsável por cadastro, login e verificação de usuário logado.
 * 
 * Utiliza bcryptjs para hash de senhas e jsonwebtoken para geração de tokens.
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { CreateUserDTO, LoginDTO, AuthResponse } from '../types/index.js';

const prisma = new PrismaClient();

/**
 * Gerar JWT Token
 * 
 * Cria um token JWT contendo o id, email e username do usuário.
 * O token expira em 7 dias.
 * 
 * @param userId - ID do usuário
 * @param email - Email do usuário
 * @param username - Username do usuário
 * @returns Token JWT assinado
 */
const generateToken = (userId: string, email: string, username: string): string => {
    const secret = process.env.JWT_SECRET || 'secret';
    return jwt.sign(
        { id: userId, email, username },
        secret,
        { expiresIn: '7d' }
    );
};

/**
 * POST /api/auth/register
 * 
 * Registra um novo usuário na plataforma.
 * Valida se email e username são únicos, faz hash da senha
 * e retorna um token JWT para login automático.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, username, password, timezone }: CreateUserDTO = req.body;

        // Validação básica
        if (!email || !username || !password) {
            res.status(400).json({ error: 'Email, username e password são obrigatórios' });
            return;
        }

        // Verificar se email já existe
        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
            res.status(400).json({ error: 'Email já cadastrado' });
            return;
        }

        // Verificar se username já existe
        const existingUsername = await prisma.user.findUnique({ where: { username } });
        if (existingUsername) {
            res.status(400).json({ error: 'Username já em uso' });
            return;
        }

        // Hash da senha (10 rounds de salt)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar usuário
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                timezone: timezone || 'America/Sao_Paulo',
            },
        });

        // Gerar token
        const token = generateToken(user.id, user.email, user.username);

        // Resposta (não retornar a senha)
        const response: AuthResponse = {
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                avatar: user.avatar || undefined,
            },
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
};

/**
 * POST /api/auth/login
 * 
 * Realiza login de um usuário existente.
 * Valida credenciais (email + senha) e retorna token JWT.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password }: LoginDTO = req.body;

        // Validação básica
        if (!email || !password) {
            res.status(400).json({ error: 'Email e password são obrigatórios' });
            return;
        }

        // Buscar usuário por email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Credenciais inválidas' });
            return;
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Credenciais inválidas' });
            return;
        }

        // Gerar token
        const token = generateToken(user.id, user.email, user.username);

        // Resposta
        const response: AuthResponse = {
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                avatar: user.avatar || undefined,
            },
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
};

/**
 * GET /api/auth/me
 * 
 * Retorna os dados do usuário autenticado.
 * Requer middleware de autenticação (req.user deve estar populado).
 * 
 * Utilizado para verificar se o token ainda é válido e
 * obter dados atualizados do usuário.
 */
export const me = async (req: Request, res: Response): Promise<void> => {
    try {
        // req.user é populado pelo middleware de autenticação
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Não autenticado' });
            return;
        }

        // Buscar usuário completo
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
                bio: true,
                timezone: true,
                createdAt: true,
            },
        });

        if (!user) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
    }
};
