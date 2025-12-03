import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Chat } from '../components/Chat';
import { DiceRoller } from '../components/DiceRoller';
import { Button } from '../components/Button';

interface Campaign {
    id: string;
    name: string;
    system: string;
}

export const SessionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/campaigns/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setCampaign(response.data);
            } catch (err) {
                console.error('Erro ao buscar campanha:', err);
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCampaign();
        }
    }, [id, navigate]);

    if (loading || !campaign) {
        return <div className="min-h-screen bg-navy-950 flex items-center justify-center text-white">Carregando sessão...</div>;
    }

    return (
        <div className="flex h-screen bg-navy-950 overflow-hidden">
            {/* Área Principal (Mapa/Cena) - Placeholder */}
            <div className="flex-1 flex flex-col relative">
                <div className="absolute top-4 left-4 z-10">
                    <Button onClick={() => navigate(`/campaigns/${id}`)} className="bg-navy-900/80 hover:bg-navy-800 text-sm backdrop-blur-sm">
                        ← Sair da Sessão
                    </Button>
                </div>

                <div className="flex-1 bg-navy-900 m-4 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">{campaign.name}</h2>
                        <p className="text-gray-500">Área do Mapa / Cena (Em Breve)</p>
                    </div>
                </div>
            </div>

            {/* Sidebar Direita (Chat e Dados) */}
            <div className="w-96 bg-navy-950 border-l border-gray-800 flex flex-col p-4 gap-4">
                <DiceRoller campaignId={campaign.id} />
                <div className="flex-1 min-h-0">
                    <Chat campaignId={campaign.id} />
                </div>
            </div>
        </div>
    );
};
