/**
 * Campaign Routes
 * 
 * Define as rotas da API para gerenciamento de campanhas.
 * Todas as rotas requerem autenticação (authMiddleware).
 */

import { Router } from 'express';
import {
    createCampaign,
    getCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign
} from '../controllers/campaignController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Todas as rotas de campanha exigem autenticação
router.use(authMiddleware);

/**
 * @route   POST /api/campaigns
 * @desc    Criar nova campanha
 * @access  Private
 */
router.post('/', createCampaign);

/**
 * @route   GET /api/campaigns
 * @desc    Listar campanhas do usuário (separadas por role)
 * @access  Private
 */
router.get('/', getCampaigns);

/**
 * @route   GET /api/campaigns/:id
 * @desc    Detalhes de uma campanha
 * @access  Private (membro da campanha)
 */
router.get('/:id', getCampaignById);

/**
 * @route   PUT /api/campaigns/:id
 * @desc    Atualizar campanha
 * @access  Private (somente MASTER)
 */
router.put('/:id', updateCampaign);

/**
 * @route   DELETE /api/campaigns/:id
 * @desc    Arquivar campanha (soft delete)
 * @access  Private (somente MASTER)
 */
router.delete('/:id', deleteCampaign);

export default router;
