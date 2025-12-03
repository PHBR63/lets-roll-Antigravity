/**
 * DashboardPage Component
 * 
 * Página principal após login. Exibe as campanhas do usuário
 * separadas em carrosséis: "Mestrando" e "Participando".
 * Permite criar nova campanha e navegar para campanhas existentes.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CampaignCard } from '../components/CampaignCard';
import axios from 'axios';

interface Campaign {
    id: string;
    name: string;
    description?: string;
    coverImage?: string;
    system: string;
    status: string;
    members: any[];
    _count: {
        characters: number;
        members: number;
    };
    myRole: 'MASTER' | 'PLAYER' | 'OBSERVER';
}

/**
 * DashboardPage
 * 
 * Busca campanhas do usuário via API e renderiza em duas seções:
 * - Campanhas onde o usuário é MASTER
 * - Campanhas onde o usuário é PLAYER/OBSERVER
 */
export const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [asMaster, setAsMaster] = useState<Campaign[]>([]);
    const [asPlayer, setAsPlayer] = useState<Campaign[]>([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/campaigns`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setAsMaster(response.data.asMaster);
                setAsPlayer(response.data.asPlayer);
            } catch (err: any) {
                console.error('Erro ao buscar campanhas:', err);
                setError('Não foi possível carregar suas campanhas.');
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    /**
     * Navega para a página de criar campanha(wizard).
     */
    const handleCreateCampaign = () => {
        navigate('/campaigns/new');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-navy-950 flex items-center justify-center">
                <div className="text-white text-xl">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-navy-950 p-6">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                        Bem-vindo, {user?.username}!
                    </h1>
                    <p className="text-gray-400">Suas campanhas de RPG</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleCreateCampaign}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        + Nova Mesa
                    </button>

                    <button
                        onClick={logout}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Sair
                    </button>
                </div>
            </header>

            {/* Mensagem de erro */}
            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Seção: Mestrando */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-white">Mestrando</h2>
                    {asMaster.length > 0 && (
                        <span className="text-gray-500 text-sm">{asMaster.length} {asMaster.length === 1 ? 'campanha' : 'campanhas'}</span>
                    )}
                </div>

                {asMaster.length === 0 ? (
                    <div className="bg-navy-900 border border-gray-700/50 rounded-lg p-8 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-400 mb-4">Você ainda não criou nenhuma campanha</p>
                        <button
                            onClick={handleCreateCampaign}
                            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Criar sua primeira mesa
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {asMaster.map((campaign) => (
                            <CampaignCard
                                key={campaign.id}
                                id={campaign.id}
                                name={campaign.name}
                                coverImage={campaign.coverImage}
                                system={campaign.system}
                                status={campaign.status}
                                memberCount={campaign._count?.members || 0}
                                characterCount={campaign._count?.characters || 0}
                                myRole={campaign.myRole}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Seção: Participando */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-white">Participando</h2>
                    {asPlayer.length > 0 && (
                        <span className="text-gray-500 text-sm">{asPlayer.length} {asPlayer.length === 1 ? 'campanha' : 'campanhas'}</span>
                    )}
                </div>

                {asPlayer.length === 0 ? (
                    <div className="bg-navy-900 border border-gray-700/50 rounded-lg p-8 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-gray-400">Você não está participando de nenhuma campanha</p>
                        <p className="text-gray-500 text-sm mt-2">Peça um convite para entrar em uma mesa!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {asPlayer.map((campaign) => (
                            <CampaignCard
                                key={campaign.id}
                                id={campaign.id}
                                name={campaign.name}
                                coverImage={campaign.coverImage}
                                system={campaign.system}
                                status={campaign.status}
                                memberCount={campaign._count?.members || 0}
                                characterCount={campaign._count?.characters || 0}
                                myRole={campaign.myRole}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
