/**
 * CampaignWizard Component
 * 
 * Wizard de 3 steps para criar uma nova campanha.
 * Step 1: Base do RPG (nome, descrição, sistema, imagem)
 * Step 2: Adquiríveis (itens e habilidades customizáveis)
 * Step 3: Personalidades (NPCs e criaturas)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Step1Base } from './steps/Step1Base';
import { Step2Acquirables } from './steps/Step2Acquirables';
import { Step3Personalities } from './steps/Step3Personalities';
import axios from 'axios';

export interface CampaignFormData {
    // Step 1
    name: string;
    description: string;
    system: string;
    coverImage?: string;

    // Step 2
    items: Array<{
        title: string;
        properties: Array<{ name: string; description: string }>;
    }>;
    abilities: Array<{
        title: string;
        properties: Array<{ name: string; description: string }>;
    }>;

    // Step 3
    npcs: Array<{
        name: string;
        bars: Array<{ title: string; type: string }>;
        properties: Array<{ name: string; description: string }>;
    }>;
    creatures: Array<{
        name: string;
        bars: Array<{ title: string; type: string }>;
        properties: Array<{ name: string; description: string }>;
    }>;
}

/**
 * CampaignWizard
 * 
 * Gerencia o estado do formulário e navegação entre steps.
 */
export const CampaignWizard: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<CampaignFormData>({
        name: '',
        description: '',
        system: 'Ordem Paranormal',
        items: [],
        abilities: [],
        npcs: [],
        creatures: []
    });

    /**
     * handleNext
     * 
     * Avança para o próximo step.
     * No último step, submete o formulário.
     */
    const handleNext = async () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            await handleSubmit();
        }
    };

    /**
     * handleBack
     * 
     * Volta para o step anterior.
     */
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    /**
     * handleSubmit
     * 
     * Envia dados para criar campanha no backend.
     */
    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError('');

            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/campaigns`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Redirecionar para a página da campanha criada
            navigate(`/campaigns/${response.data.id}`);
        } catch (err: any) {
            console.error('Erro ao criar campanha:', err);
            setError(err.response?.data?.error || 'Erro ao criar campanha');
            setLoading(false);
        }
    };

    /**
     * updateFormData
     * 
     * Atualiza parcialmente os dados do formulário.
     */
    const updateFormData = (data: Partial<CampaignFormData>) => {
        setFormData({ ...formData, ...data });
    };

    const steps = [
        { number: 1, title: 'Base do RPG', subtitle: 'Informações básicas' },
        { number: 2, title: 'Adquiríveis', subtitle: 'Itens e habilidades' },
        { number: 3, title: 'Personalidades', subtitle: 'NPCs e criaturas' }
    ];

    return (
        <div className="min-h-screen bg-navy-950 p-6">
            {/* Header com steps */}
            <div className="max-w-6xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-white mb-6">Criar Nova Campanha</h1>

                {/* Wizard Steps */}
                <div className="flex items-center justify-between mb-8">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.number}>
                            {/* Step indicator */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-colors ${currentStep >= step.number
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-navy-800 text-gray-500'
                                        }`}
                                >
                                    {step.number}
                                </div>
                                <div className="text-center mt-2">
                                    <p className={`font-medium ${currentStep >= step.number ? 'text-white' : 'text-gray-500'}`}>
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-gray-600">{step.subtitle}</p>
                                </div>
                            </div>

                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 mx-4">
                                    <div
                                        className={`h-1 rounded transition-colors ${currentStep > step.number ? 'bg-primary-500' : 'bg-navy-800'
                                            }`}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}
            </div>

            {/* Step content */}
            <div className="max-w-6xl mx-auto">
                {currentStep === 1 && (
                    <Step1Base formData={formData} updateFormData={updateFormData} />
                )}
                {currentStep === 2 && (
                    <Step2Acquirables formData={formData} updateFormData={updateFormData} />
                )}
                {currentStep === 3 && (
                    <Step3Personalities formData={formData} updateFormData={updateFormData} />
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-700 hover:bg-gray-600 text-white"
                    >
                        Voltar
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={loading || !formData.name}
                        className="px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-primary-500 hover:bg-primary-600 text-white"
                    >
                        {loading ? 'Criando...' : currentStep === 3 ? 'Finalizar' : 'Prosseguir'}
                    </button>
                </div>
            </div>
        </div>
    );
};
