/**
 * Step1Base Component
 * 
 * Primeiro step do wizard: informações básicas da campanha.
 * - Nome
 * - Descrição
 * - Sistema de RPG (cards selecionáveis)
 * - Upload de imagem (placeholder)
 */

import React from 'react';
import type { CampaignFormData } from '../CampaignWizard';
import { Card } from '../Card';
import { Input } from '../Input';

interface Step1BaseProps {
    formData: CampaignFormData;
    updateFormData: (data: Partial<CampaignFormData>) => void;
}

const SYSTEMS = [
    { id: 'ordem-paranormal', name: 'Ordem Paranormal', icon: '🔮' },
    { id: 'dnd-5e', name: 'D&D 5ª Edição', icon: '🐉' },
    { id: 'call-of-cthulhu', name: 'Call of Cthulhu', icon: '🦑' },
    { id: 'custom', name: 'Sistema Customizado', icon: '⚙️' }
];

/**
 * Step1Base
 * 
 * Formulário do step 1 com validação básica.
 */
export const Step1Base: React.FC<Step1BaseProps> = ({ formData, updateFormData }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda: Upload de Imagem */}
            <div>
                <Card>
                    <h3 className="text-white font-semibold text-lg mb-4">Imagem de Capa</h3>

                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
                        {formData.coverImage ? (
                            <img
                                src={formData.coverImage}
                                alt="Capa da campanha"
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                        ) : (
                            <>
                                <svg
                                    className="w-16 h-16 mx-auto mb-4 text-gray-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <p className="text-gray-400 mb-2">Clique para fazer upload</p>
                                <p className="text-gray-600 text-sm">ou arraste uma imagem aqui</p>
                            </>
                        )}
                    </div>

                    <p className="text-gray-500 text-xs mt-2">
                        Recomendado: 1200x600px (JPG ou PNG)
                    </p>
                </Card>
            </div>

            {/* Coluna Direita: Formulário */}
            <div className="space-y-6">
                {/* Nome da Campanha */}
                <Card>
                    <Input
                        label="Nome da Campanha"
                        value={formData.name}
                        onChange={(e) => updateFormData({ name: e.target.value })}
                        placeholder="Ex: A Ordem da Névoa"
                        required
                    />
                </Card>

                {/* Descrição */}
                <Card>
                    <label className="block text-white font-medium mb-2">
                        Descrição
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData({ description: e.target.value })}
                        placeholder="Descreva sua campanha..."
                        className="w-full bg-navy-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                        rows={4}
                    />
                </Card>

                {/* Sistema de RPG */}
                <Card>
                    <h3 className="text-white font-semibold mb-4">Sistema do RPG</h3>

                    <div className="grid grid-cols-2 gap-3">
                        {SYSTEMS.map((system) => (
                            <button
                                key={system.id}
                                onClick={() => updateFormData({ system: system.name })}
                                className={`p-4 rounded-lg border-2 transition-colors text-left ${formData.system === system.name
                                    ? 'border-primary-500 bg-primary-500/10'
                                    : 'border-gray-700 hover:border-gray-600'
                                    }`}
                            >
                                <div className="text-3xl mb-2">{system.icon}</div>
                                <p className={`font-medium ${formData.system === system.name ? 'text-primary-400' : 'text-white'
                                    }`}>
                                    {system.name}
                                </p>
                            </button>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};
