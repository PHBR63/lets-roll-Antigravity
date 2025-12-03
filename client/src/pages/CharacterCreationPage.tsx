import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

const CLASSES = [
    { id: 'combatente', name: 'Combatente', description: 'Especialista em combate e resistência.' },
    { id: 'especialista', name: 'Especialista', description: 'Focado em perícias e utilidade.' },
    { id: 'ocultista', name: 'Ocultista', description: 'Mestre em rituais e o paranormal.' }
];

export const CharacterCreationPage: React.FC = () => {
    const { campaignId } = useParams<{ campaignId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        class: 'combatente',
        attributes: {
            agilidade: 1,
            forca: 1,
            intelecto: 1,
            presenca: 1,
            vigor: 1
        }
    });

    const handleAttributeChange = (attr: string, value: number) => {
        setFormData(prev => ({
            ...prev,
            attributes: {
                ...prev.attributes,
                [attr]: Math.max(0, value) // Não permite negativo
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/characters`,
                {
                    campaignId,
                    name: formData.name,
                    class: formData.class,
                    attributes: formData.attributes
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            navigate(`/campaigns/${campaignId}`);
        } catch (err: any) {
            console.error('Erro ao criar personagem:', err);
            setError(err.response?.data?.error || 'Erro ao criar personagem');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy-950 p-6 flex items-center justify-center">
            <div className="max-w-2xl w-full">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">Novo Personagem</h1>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Nome do Personagem"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Arthur Cervero"
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Classe</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {CLASSES.map((cls) => (
                                    <button
                                        key={cls.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, class: cls.id })}
                                        className={`p-4 rounded-lg border-2 text-left transition-colors ${formData.class === cls.id
                                            ? 'border-primary-500 bg-primary-500/10'
                                            : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                    >
                                        <p className={`font-bold ${formData.class === cls.id ? 'text-primary-400' : 'text-white'}`}>
                                            {cls.name}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{cls.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-4">Atributos Iniciais</label>
                            <div className="grid grid-cols-5 gap-2 text-center">
                                {Object.entries(formData.attributes).map(([attr, val]) => (
                                    <div key={attr} className="bg-navy-900 p-3 rounded-lg border border-gray-700">
                                        <p className="text-xs text-gray-400 uppercase mb-2">{attr.substring(0, 3)}</p>
                                        <div className="flex flex-col items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleAttributeChange(attr, val + 1)}
                                                className="text-green-400 hover:text-green-300"
                                            >
                                                ▲
                                            </button>
                                            <span className="text-xl font-bold text-white">{val}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleAttributeChange(attr, val - 1)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                ▼
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="bg-gray-700 hover:bg-gray-600 text-white w-full"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || !formData.name}
                                className="w-full"
                            >
                                {loading ? 'Criando...' : 'Criar Personagem'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};
