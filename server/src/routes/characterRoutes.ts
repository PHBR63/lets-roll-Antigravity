import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
    createCharacter,
    getCharacter,
    updateCharacter,
    deleteCharacter,
    getCampaignCharacters
} from '../controllers/characterController';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.post('/', createCharacter);
router.get('/:id', getCharacter);
router.put('/:id', updateCharacter);
router.delete('/:id', deleteCharacter);
router.get('/campaign/:campaignId', getCampaignCharacters);

export default router;
