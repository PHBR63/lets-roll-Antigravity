/**
 * Auth Routes
 * 
 * Define as rotas de autenticação da API.
 * Todas as rotas começam com /api/auth
 */

import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * POST /api/auth/register
 * Registra um novo usuário
 * Body: { email, username, password, timezone? }
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Realiza login de um usuário
 * Body: { email, password }
 */
router.post('/login', login);

/**
 * GET /api/auth/me
 * Retorna dados do usuário autenticado
 * Requer autenticação (Bearer token)
 */
router.get('/me', authMiddleware, me);

export default router;
