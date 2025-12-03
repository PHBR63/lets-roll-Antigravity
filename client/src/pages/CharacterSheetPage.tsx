import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface Character {
    id: string;
    name: string;
    class: string;
    agilidade: number;
    forca: number;
    intelecto: number;
    presenca: number;
    vigor: number;
    pv: number;
    pvMax: number;
    san: number;
    sanMax: number;
    pe: number;
    peMax: number;
    nex: number;
    user: {
        username: string;
    };
    campaign: {
        name: string;
    };
}

export const CharacterSheetPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/characters/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setCharacter(response.data);
            } catch (err) {
                console.error('Erro ao buscar personagem:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCharacter();
        }
    }, [id]);

    if (loading) return <div className="text-white text-center p-8">Carregando ficha...</div>;
    if (!character) return <div className="text-white text-center p-8">Personagem não encontrado.</div>;

    const attributes = [
        { label: 'AGI', value: character.agilidade },
        { label: 'FOR', value: character.forca },
        { label: 'INT', value: character.intelecto },
        { label: 'PRE', value: character.presenca },
        { label: 'VIG', value: character.vigor },
    ];

    return (
        <div className="min-h-screen bg-navy-950 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <Button onClick={() => navigate(-1)} className="bg-gray-700 hover:bg-gray-600 text-sm py-2">
                        ← Voltar
                    </Button>
                    <h1 className="text-2xl font-bold text-white">{character.name}</h1>
                    <span className="text-gray-400 text-sm">{character.class} • NEX {character.nex}%</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Coluna 1: Atributos */}
                    <div className="space-y-4">
                        <Card>
                            <h3 className="text-white font-semibold mb-4 text-center">Atributos</h3>
                            <div className="flex flex-col gap-4">
                                {attributes.map((attr) => (
                                    <div key={attr.label} className="flex justify-between items-center bg-navy-900 p-3 rounded">
                                        <span className="text-gray-400 font-bold">{attr.label}</span>
                                        <span className="text-2xl text-white font-bold">{attr.value}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Coluna 2: Barras de Status */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <div className="grid grid-cols-3 gap-4 text-center mb-6">
                                <div>
                                    <p className="text-red-400 font-bold mb-1">PV</p>
                                    <div className="text-2xl text-white">{character.pv} <span className="text-sm text-gray-500">/ {character.pvMax}</span></div>
                                    <div className="w-full bg-gray-800 h-2 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-red-600 h-full" style={{ width: `${(character.pv / character.pvMax) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-blue-400 font-bold mb-1">SAN</p>
                                    <div className="text-2xl text-white">{character.san} <span className="text-sm text-gray-500">/ {character.sanMax}</span></div>
                                    <div className="w-full bg-gray-800 h-2 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-blue-600 h-full" style={{ width: `${(character.san / character.sanMax) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-yellow-400 font-bold mb-1">PE</p>
                                    <div className="text-2xl text-white">{character.pe} <span className="text-sm text-gray-500">/ {character.peMax}</span></div>
                                    <div className="w-full bg-gray-800 h-2 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-yellow-600 h-full" style={{ width: `${(character.pe / character.peMax) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <h3 className="text-white font-semibold mb-2">Defesa</h3>
                                <p className="text-3xl font-bold text-gray-200">10</p>
                            </Card>
                            <Card>
                                <h3 className="text-white font-semibold mb-2">Deslocamento</h3>
                                <p className="text-3xl font-bold text-gray-200">9m</p>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
