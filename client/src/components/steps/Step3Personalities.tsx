/**
 * Step3Personalities Component
 * 
 * Terceiro e último step do wizard: definição de NPCs e criaturas.
 * Permite criar templates de personalidades com barras customizáveis.
 */

import React from 'react';
import type { CampaignFormData } from '../CampaignWizard';
import { Card } from '../Card';

interface Step3PersonalitiesProps {
    formData: CampaignFormData;
    updateFormData: (data: Partial<CampaignFormData>) => void;
}

const BAR_TYPES = [
    { value: 'horizontal', label: 'Horizontal' },
    { value: 'numerico', label: 'Numérico' },
    { value: 'porcentagem', label: 'Porcentagem' }
];

/**
 * Step3Personalities
 * 
 * Gerencia NPCs e criaturas com barras e propriedades customizáveis.
 */
export const Step3Personalities: React.FC<Step3PersonalitiesProps> = ({ formData, updateFormData }) => {

    const addNPC = () => {
        updateFormData({
            npcs: [...formData.npcs, { name: '', bars: [], properties: [] }]
        });
    };

    const removeNPC = (index: number) => {
        updateFormData({
            npcs: formData.npcs.filter((_, i) => i !== index)
        });
    };

    const updateNPC = (index: number, field: string, value: any) => {
        const updated = [...formData.npcs];
        updated[index] = { ...updated[index], [field]: value };
        updateFormData({ npcs: updated });
    };

    const addBar = (npcIndex: number) => {
        const updated = [...formData.npcs];
        updated[npcIndex].bars.push({ title: '', type: 'horizontal' });
        updateFormData({ npcs: updated });
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Personalidades (NPCs/Criaturas)</h2>
                <p className="text-gray-400">
                    Crie templates de NPCs e criaturas com barras de status customizáveis.
                    Opcional: você pode adicionar depois.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {formData.npcs.map((npc, index) => (
                    <Card key={index}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-white font-semibold">Personalidade #{index + 1}</h3>
                            <button
                                onClick={() => removeNPC(index)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Nome */}
                        <input
                            value={npc.name}
                            onChange={(e) => updateNPC(index, 'name', e.target.value)}
                            placeholder="Nome (ex: Cultista, Lobisomem)"
                            className="w-full bg-navy-950 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none mb-4"
                        />

                        {/* Barras */}
                        <div className="space-y-2 mb-4">
                            <p className="text-gray-400 text-sm font-medium">Barras de Status</p>

                            {npc.bars.map((bar, barIndex) => (
                                <div key={barIndex} className="grid grid-cols-2 gap-2">
                                    <input
                                        value={bar.title}
                                        onChange={(e) => {
                                            const updated = [...formData.npcs];
                                            updated[index].bars[barIndex].title = e.target.value;
                                            updateFormData({ npcs: updated });
                                        }}
                                        placeholder="Título (ex: Vida)"
                                        className="bg-navy-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                    />
                                    <select
                                        value={bar.type}
                                        onChange={(e) => {
                                            const updated = [...formData.npcs];
                                            updated[index].bars[barIndex].type = e.target.value;
                                            updateFormData({ npcs: updated });
                                        }}
                                        className="bg-navy-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                    >
                                        {BAR_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}

                            <button
                                onClick={() => addBar(index)}
                                className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-primary-500 transition-colors text-sm"
                            >
                                + Adicionar Barra
                            </button>
                        </div>

                        {/* Propriedades */}
                        <div className="space-y-2">
                            <p className="text-gray-400 text-sm font-medium">Propriedades Customizadas</p>
                            <button
                                onClick={() => {
                                    const updated = [...formData.npcs];
                                    updated[index].properties.push({ name: '', description: '' });
                                    updateFormData({ npcs: updated });
                                }}
                                className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-primary-500 transition-colors text-sm"
                            >
                                + Adicionar Propriedade
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Botão para adicionar novo NPC */}
            <button
                onClick={addNPC}
                className="mt-6 w-full py-4 border-2 border-dashed border-primary-500/50 rounded-lg text-primary-400 hover:bg-primary-500/10 transition-colors font-medium"
            >
                + Adicionar Nova Personalidade
            </button>

            {formData.npcs.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">Nenhuma personalidade adicionada. Você pode pular este step!</p>
                </div>
            )}
        </div>
    );
};
