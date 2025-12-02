/**
 * CampaignCard Component
 * 
 * Card visual para exibir uma campanha no dashboard.
 * Mostra capa, nome, sistema, número de jogadores e botão de ação.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CampaignCardProps {
    id: string;
    name: string;
    coverImage?: string;
    system: string;
    status: string;
    memberCount: number;
    characterCount: number;
    myRole: 'MASTER' | 'PLAYER' | 'OBSERVER';
}

/**
 * CampaignCard
 * 
 * Renderiza um card de campanha com imagem, informações e botão de ação.
 * O botão muda conforme o role (Iniciar para MASTER, Entrar para PLAYER).
 */
export const CampaignCard: React.FC<CampaignCardProps> = ({
    id,
    name,
    coverImage,
    system,
    status,
    memberCount,
    myRole
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/campaigns/${id}`);
    };

    // Status badge color
    const statusColor = status === 'ACTIVE'
        ? 'bg-green-500'
        : status === 'PAUSED'
            ? 'bg-yellow-500'
            : 'bg-gray-500';

    return (
        <div className="bg-navy-900 rounded-lg overflow-hidden border border-gray-700/50 hover:border-primary-500 transition-all duration-200 group cursor-pointer">
            {/* Imagem de capa */}
            <div className="relative h-40 bg-navy-800 overflow-hidden">
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                )}

                {/* Badge de status */}
                <div className="absolute top-2 right-2">
                    <span className={`${statusColor} text-xs px-2 py-1 rounded-full text-white font-semibold`}>
                        {status}
                    </span>
                </div>
            </div>

            {/* Informações */}
            <div className="p-4">
                <h3 className="text-white font-semibold text-lg mb-1 truncate">
                    {name}
                </h3>

                <p className="text-gray-400 text-sm mb-3">
                    {system}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {memberCount} {memberCount === 1 ? 'jogador' : 'jogadores'}
                    </span>
                </div>

                {/* Botão de ação */}
                <button
                    onClick={handleClick}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
                >
                    {myRole === 'MASTER' ? 'Gerenciar' : 'Entrar'}
                </button>
            </div>
        </div>
    );
};
