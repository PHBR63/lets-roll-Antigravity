import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * createCharacter
 * 
 * Cria um novo personagem vinculado a uma campanha e usuário.
 * 
 * @route POST /api/characters
 */
export const createCharacter = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { campaignId, name, class: characterClass, attributes } = req.body;

        if (!campaignId || !name || !characterClass) {
            return res.status(400).json({ error: 'Campos obrigatórios: campaignId, name, class' });
        }

        // Verificar se usuário é membro da campanha
        const membership = await prisma.campaignMember.findUnique({
            where: {
                campaignId_userId: {
                    campaignId,
                    userId
                }
            }
        });

        if (!membership) {
            return res.status(403).json({ error: 'Você deve ser membro da campanha para criar um personagem' });
        }

        const character = await prisma.character.create({
            data: {
                userId,
                campaignId,
                name,
                class: characterClass,
                // Atributos iniciais
                agilidade: attributes?.agilidade || 0,
                forca: attributes?.forca || 0,
                intelecto: attributes?.intelecto || 0,
                presenca: attributes?.presenca || 0,
                vigor: attributes?.vigor || 0,
                // Valores padrão
                pv: 10 + (attributes?.vigor || 0),
                pvMax: 10 + (attributes?.vigor || 0),
                san: 10,
                sanMax: 10,
                pe: 5,
                peMax: 5
            }
        });

        res.status(201).json(character);
    } catch (error) {
        console.error('Erro ao criar personagem:', error);
        res.status(500).json({ error: 'Erro ao criar personagem' });
    }
};

/**
 * getCharacter
 * 
 * Retorna detalhes de um personagem.
 * 
 * @route GET /api/characters/:id
 */
export const getCharacter = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        const character = await prisma.character.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, username: true, avatar: true } },
                campaign: { select: { id: true, name: true, system: true } }
            }
        });

        if (!character) {
            return res.status(404).json({ error: 'Personagem não encontrado' });
        }

        // Verificar acesso (membro da campanha)
        const membership = await prisma.campaignMember.findUnique({
            where: {
                campaignId_userId: {
                    campaignId: character.campaignId,
                    userId
                }
            }
        });

        if (!membership) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        res.json(character);
    } catch (error) {
        console.error('Erro ao buscar personagem:', error);
        res.status(500).json({ error: 'Erro ao buscar personagem' });
    }
};

/**
 * updateCharacter
 * 
 * Atualiza status, inventário, etc.
 * 
 * @route PUT /api/characters/:id
 */
export const updateCharacter = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;
        const updates = req.body;

        const character = await prisma.character.findUnique({ where: { id } });

        if (!character) {
            return res.status(404).json({ error: 'Personagem não encontrado' });
        }

        // Apenas dono ou mestre pode editar (simplificado: apenas dono por enquanto)
        if (character.userId !== userId) {
            // TODO: Permitir mestre editar também
            return res.status(403).json({ error: 'Apenas o dono pode editar o personagem' });
        }

        const updated = await prisma.character.update({
            where: { id },
            data: updates
        });

        res.json(updated);
    } catch (error) {
        console.error('Erro ao atualizar personagem:', error);
        res.status(500).json({ error: 'Erro ao atualizar personagem' });
    }
};

/**
 * deleteCharacter
 * 
 * Remove um personagem.
 * 
 * @route DELETE /api/characters/:id
 */
export const deleteCharacter = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        const character = await prisma.character.findUnique({ where: { id } });

        if (!character) {
            return res.status(404).json({ error: 'Personagem não encontrado' });
        }

        if (character.userId !== userId) {
            return res.status(403).json({ error: 'Apenas o dono pode deletar o personagem' });
        }

        await prisma.character.delete({ where: { id } });

        res.json({ message: 'Personagem deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar personagem:', error);
        res.status(500).json({ error: 'Erro ao deletar personagem' });
    }
};

/**
 * getCampaignCharacters
 * 
 * Lista personagens de uma campanha.
 * 
 * @route GET /api/characters/campaign/:campaignId
 */
export const getCampaignCharacters = async (req: Request, res: Response) => {
    try {
        const { campaignId } = req.params;
        const userId = (req as any).user.id;

        // Verificar acesso
        const membership = await prisma.campaignMember.findUnique({
            where: {
                campaignId_userId: {
                    campaignId,
                    userId
                }
            }
        });

        if (!membership) {
            return res.status(403).json({ error: 'Acesso negado à campanha' });
        }

        const characters = await prisma.character.findMany({
            where: { campaignId },
            include: {
                user: { select: { id: true, username: true, avatar: true } }
            }
        });

        res.json(characters);
    } catch (error) {
        console.error('Erro ao listar personagens:', error);
        res.status(500).json({ error: 'Erro ao listar personagens' });
    }
};
