/**
 * Campaign Controller
 * 
 * Gerencia operações CRUD de campanhas e membership.
 * Funções: criar, listar, atualizar, deletar campanhas.
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * createCampaign
 * 
 * Cria uma nova campanha e automaticamente adiciona o criador como MASTER.
 * 
 * @route POST /api/campaigns
 * @body { name, description?, coverImage?, system? }
 */
export const createCampaign = async (req: Request, res: Response) => {
    try {
        const { name, description, coverImage, system } = req.body;
        const userId = (req as any).user.id; // ID do usuário autenticado (vem do middleware)

        // Validação básica
        if (!name) {
            return res.status(400).json({ error: 'Nome da campanha é obrigatório' });
        }

        // Criar campanha + adicionar criador como mestre em uma transação
        const campaign = await prisma.campaign.create({
            data: {
                name,
                description: description || null,
                coverImage: coverImage || null,
                system: system || 'Ordem Paranormal',
                members: {
                    create: {
                        userId,
                        role: 'MASTER'
                    }
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, username: true, avatar: true }
                        }
                    }
                }
            }
        });

        res.status(201).json(campaign);
    } catch (error) {
        console.error('Erro ao criar campanha:', error);
        res.status(500).json({ error: 'Erro ao criar campanha' });
    }
};

/**
 * getCampaigns
 * 
 * Lista todas as campanhas do usuário autenticado.
 * Retorna separadamente: campanhas onde é mestre e onde é jogador.
 * 
 * @route GET /api/campaigns
 */
export const getCampaigns = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        // Buscar todas as campanhas do usuário (como membro)
        const memberships = await prisma.campaignMember.findMany({
            where: { userId },
            include: {
                campaign: {
                    include: {
                        members: {
                            include: {
                                user: {
                                    select: { id: true, username: true, avatar: true }
                                }
                            }
                        },
                        _count: {
                            select: { characters: true }
                        }
                    }
                }
            }
        });

        // Separar por role
        const asMaster = memberships
            .filter(m => m.role === 'MASTER')
            .map(m => ({ ...m.campaign, myRole: 'MASTER' }));

        const asPlayer = memberships
            .filter(m => m.role === 'PLAYER' || m.role === 'OBSERVER')
            .map(m => ({ ...m.campaign, myRole: m.role }));

        res.json({
            asMaster,
            asPlayer
        });
    } catch (error) {
        console.error('Erro ao listar campanhas:', error);
        res.status(500).json({ error: 'Erro ao listar campanhas' });
    }
};

/**
 * getCampaignById
 * 
 * Retorna detalhes de uma campanha específica.
 * Verifica se o usuário é membro antes de permitir acesso.
 * 
 * @route GET /api/campaigns/:id
 */
export const getCampaignById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        // Verificar se usuário é membro
        const membership = await prisma.campaignMember.findUnique({
            where: {
                campaignId_userId: {
                    campaignId: id,
                    userId
                }
            }
        });

        if (!membership) {
            return res.status(403).json({ error: 'Acesso negado a esta campanha' });
        }

        // Buscar campanha completa
        const campaign = await prisma.campaign.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, username: true, avatar: true }
                        }
                    }
                },
                characters: {
                    include: {
                        user: {
                            select: { id: true, username: true }
                        }
                    }
                },
                _count: {
                    select: { characters: true, members: true }
                }
            }
        });

        res.json({ ...campaign, myRole: membership.role });
    } catch (error) {
        console.error('Erro ao buscar campanha:', error);
        res.status(500).json({ error: 'Erro ao buscar campanha' });
    }
};

/**
 * updateCampaign
 * 
 * Atualiza informações de uma campanha.
 * Somente o MASTER pode editar.
 * 
 * @route PUT /api/campaigns/:id
 */
export const updateCampaign = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;
        const { name, description, coverImage, system, status, items, abilities, npcs, creatures } = req.body;

        // Verificar se é MASTER
        const membership = await prisma.campaignMember.findUnique({
            where: {
                campaignId_userId: {
                    campaignId: id,
                    userId
                }
            }
        });

        if (!membership || membership.role !== 'MASTER') {
            return res.status(403).json({ error: 'Apenas o mestre pode editar a campanha' });
        }

        // Atualizar campanha
        const updated = await prisma.campaign.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(coverImage !== undefined && { coverImage }),
                ...(system && { system }),
                ...(status && { status }),
                ...(items !== undefined && { items }),
                ...(abilities !== undefined && { abilities }),
                ...(npcs !== undefined && { npcs }),
                ...(creatures !== undefined && { creatures })
            }
        });

        res.json(updated);
    } catch (error) {
        console.error('Erro ao atualizar campanha:', error);
        res.status(500).json({ error: 'Erro ao atualizar campanha' });
    }
};

/**
 * deleteCampaign
 * 
 * Marca campanha como ENDED (soft delete).
 * Somente o MASTER pode arquivar.
 * 
 * @route DELETE /api/campaigns/:id
 */
export const deleteCampaign = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        // Verificar se é MASTER
        const membership = await prisma.campaignMember.findUnique({
            where: {
                campaignId_userId: {
                    campaignId: id,
                    userId
                }
            }
        });

        if (!membership || membership.role !== 'MASTER') {
            return res.status(403).json({ error: 'Apenas o mestre pode arquivar a campanha' });
        }

        // Mudar status para ENDED em vez de deletar
        const archived = await prisma.campaign.update({
            where: { id },
            data: { status: 'ENDED' }
        });

        res.json({ message: 'Campanha arquivada com sucesso', campaign: archived });
    } catch (error) {
        console.error('Erro ao arquivar campanha:', error);
        res.status(500).json({ error: 'Erro ao arquivar campanha' });
    }
};
