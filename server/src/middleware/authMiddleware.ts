/**
 * Auth Middleware
 * 
 * Middleware para proteger rotas que requerem autenticação.
 * Verifica o token JWT no header Authorization e valida sua assinatura.
 * 
 * Se válido, adiciona os dados do usuário em req.user para uso
 * nas rotas protegidas.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types/index.js';

/**
 * Extender a interface Request do Express
 * para incluir a propriedade user
 */
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

/**
 * Middleware de Autenticação
 * 
 * Valida o token JWT presente no header Authorization.
 * Formato esperado: "Bearer <token>"
 * 
 * Se o token é válido, popula req.user com os dados do payload.
 * Caso contrário, retorna 401 Unauthorized.
 * 
 * @param req - Request do Express
 * @param res - Response do Express
 * @param next - NextFunction para continuar a cadeia de middlewares
 */
export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Obter header de autorização
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({ error: 'Token não fornecido' });
            return;
        }

        // Extrair token (formato: "Bearer <token>")
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            res.status(401).json({ error: 'Formato de token inválido' });
            return;
        }

        const token = parts[1];
        const secret = process.env.JWT_SECRET || 'secret';

        // Verificar e decodificar token
        const decoded = jwt.verify(token, secret) as UserPayload;

        // Adicionar dados do usuário à requisição
        req.user = decoded;

        // Continuar para a próxima função
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: 'Token inválido' });
            return;
        }
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: 'Token expirado' });
            return;
        }
        res.status(500).json({ error: 'Erro ao validar token' });
    }
};
