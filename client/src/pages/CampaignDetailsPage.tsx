import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface Campaign {
    id: string;
    name: string;
    description: string;
    system: string;
    coverImage?: string;
}

export const CampaignDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [characters, setCharacters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [campRes, charRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/campaigns/${id}`, { headers }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/characters/campaign/${id}`, { headers })
                ]);

                setCampaign(campRes.data);
                setCharacters(charRes.data);
            } catch (err) {
                console.error('Erro ao buscar dados:', err);
                setError('Erro ao carregar detalhes da campanha.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-navy-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error || !campaign) {
        return (
            <div className="min-h-screen bg-navy-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-xl mb-4">{error || 'Campanha não encontrada'}</p>
                    <Button onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-navy-950 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header com Imagem de Capa */}
                <div className="relative rounded-xl overflow-hidden h-64 md:h-80 mb-8 shadow-2xl">
                    {campaign.coverImage ? (
                        <img
                            src={campaign.coverImage}
                            alt={campaign.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
                            <span className="text-6xl">🎲</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent flex flex-col justify-end p-8">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium mb-2 border border-primary-500/30">
                                    {campaign.system}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{campaign.name}</h1>
                            </div>
                            <Button
                                onClick={() => console.log('Entrar na sessão (em breve)')}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg shadow-lg shadow-green-900/20"
                            >
                                ▶ Entrar na Sessão
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Coluna Principal */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <h2 className="text-xl font-semibold text-white mb-4">Sobre a Campanha</h2>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                {campaign.description}
                            </p>
                        </Card>

                        <Card>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-white">Personagens</h2>
                                <Button
                                    onClick={() => navigate(`/campaigns/${id}/create-character`)}
                                    className="text-sm py-2"
                                >
                                    + Criar Personagem
                                </Button>
                            </div>

                            {characters.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {characters.map(char => (
                                        <div
                                            key={char.id}
                                            onClick={() => navigate(`/characters/${char.id}`)}
                                            className="bg-navy-900 p-4 rounded-lg border border-gray-700 hover:border-primary-500 cursor-pointer transition-colors flex items-center gap-4"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-primary-900 flex items-center justify-center text-primary-400 font-bold text-xl">
                                                {char.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold">{char.name}</h3>
                                                <p className="text-gray-400 text-sm">{char.class} • NEX {char.nex}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
                                    <p className="text-gray-500 mb-4">Nenhum personagem criado ainda.</p>
                                    <Button onClick={() => navigate(`/campaigns/${id}/create-character`)}>
                                        Criar meu Personagem
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-white">Jogadores</h2>
                                <button className="text-primary-400 hover:text-primary-300 text-sm">+ Convidar</button>
                            </div>
                            <div className="space-y-3">
                                {/* Mock de jogadores por enquanto */}
                                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white">
                                        M
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Mestre</p>
                                        <p className="text-xs text-purple-400">Game Master</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h2 className="text-xl font-semibold text-white mb-4">Ações Rápidas</h2>
                            <div className="space-y-2">
                                <button className="w-full text-left px-4 py-3 rounded bg-navy-800 hover:bg-navy-700 text-gray-300 transition-colors">
                                    📝 Editar Campanha
                                </button>
                                <button className="w-full text-left px-4 py-3 rounded bg-navy-800 hover:bg-navy-700 text-gray-300 transition-colors">
                                    📜 Ver Diário
                                </button>
                                <button className="w-full text-left px-4 py-3 rounded bg-navy-800 hover:bg-navy-700 text-gray-300 transition-colors">
                                    👥 Gerenciar NPCs
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
