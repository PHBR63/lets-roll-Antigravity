/**
 * Step2Acquirables Component
 * 
 * Segundo step do wizard: definição de itens e habilidades customizáveis.
 * Permite ao mestre criar templates de adquiríveis para sua campanha.
 */

import React from 'react';
import type { CampaignFormData } from '../CampaignWizard';
import { Card } from '../Card';

interface Step2AcquirablesProps {
    formData: CampaignFormData;
    updateFormData: (data: Partial<CampaignFormData>) => void;
}

/**
 * Step2Acquirables
 * 
 * Gerencia listas dinâmicas de itens e habilidades.
 */
export const Step2Acquirables: React.FC<Step2AcquirablesProps> = ({ formData, updateFormData }) => {

    const addItem = () => {
        updateFormData({
            items: [...formData.items, { title: '', properties: [] }]
        });
    };

    const removeItem = (index: number) => {
        updateFormData({
            items: formData.items.filter((_, i) => i !== index)
        });
    };

    const updateItem = (index: number, field: string, value: any) => {
        const updated = [...formData.items];
        updated[index] = { ...updated[index], [field]: value };
        updateFormData({ items: updated });
    };

    const addItemProperty = (itemIndex: number) => {
        const updated = [...formData.items];
        updated[itemIndex].properties.push({ name: '', description: '' });
        updateFormData({ items: updated });
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Adquiríveis da Campanha</h2>
                <p className="text-gray-400">
                    Defina templates de itens e habilidades que os jogadores poderão usar.
                    Você pode deixar em branco e adicionar depois.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {formData.items.map((item, index) => (
                    <Card key={index}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-white font-semibold">Item/Habilidade #{index + 1}</h3>
                            <button
                                onClick={() => removeItem(index)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Título */}
                        <input
                            value={item.title}
                            onChange={(e) => updateItem(index, 'title', e.target.value)}
                            placeholder="Título (ex: Espada Longa)"
                            className="w-full bg-navy-950 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none mb-4"
                        />

                        {/* Propriedades */}
                        <div className="space-y-2">
                            <p className="text-gray-400 text-sm font-medium">Propriedades</p>

                            {item.properties.map((prop, propIndex) => (
                                <div key={propIndex} className="grid grid-cols-2 gap-2">
                                    <input
                                        value={prop.name}
                                        onChange={(e) => {
                                            const updated = [...formData.items];
                                            updated[index].properties[propIndex].name = e.target.value;
                                            updateFormData({ items: updated });
                                        }}
                                        placeholder="Nome (ex: Dano)"
                                        className="bg-navy-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                    />
                                    <input
                                        value={prop.description}
                                        onChange={(e) => {
                                            const updated = [...formData.items];
                                            updated[index].properties[propIndex].description = e.target.value;
                                            updateFormData({ items: updated });
                                        }}
                                        placeholder="Valor (ex: 1d8)"
                                        className="bg-navy-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                    />
                                </div>
                            ))}

                            <button
                                onClick={() => addItemProperty(index)}
                                className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-primary-500 transition-colors text-sm"
                            >
                                + Adicionar Propriedade
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Botão para adicionar novo item */}
            <button
                onClick={addItem}
                className="mt-6 w-full py-4 border-2 border-dashed border-primary-500/50 rounded-lg text-primary-400 hover:bg-primary-500/10 transition-colors font-medium"
            >
                + Adicionar Novo Item/Habilidade
            </button>

            {formData.items.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">Nenhum item adicionado ainda. Clique no botão acima para começar!</p>
                </div>
            )}
        </div>
    );
};
