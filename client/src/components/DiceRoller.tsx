import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

interface DiceRollerProps {
    campaignId: string;
}

const DICES = [
    { label: 'd4', value: 4 },
    { label: 'd6', value: 6 },
    { label: 'd8', value: 8 },
    { label: 'd10', value: 10 },
    { label: 'd12', value: 12 },
    { label: 'd20', value: 20 },
    { label: 'd100', value: 100 },
];

export const DiceRoller: React.FC<DiceRollerProps> = ({ campaignId }) => {
    const { socket } = useSocket();
    const { user } = useAuth();
    const [customFormula, setCustomFormula] = useState('');

    const rollDice = (sides: number) => {
        if (!socket || !user) return;

        const result = Math.floor(Math.random() * sides) + 1;

        const messageData = {
            campaignId,
            content: `Rolou 1d${sides}: **${result}**`,
            type: 'DICE_ROLL',
            user: {
                username: user.username,
                avatar: user.avatar
            },
            timestamp: new Date().toISOString(),
            id: Date.now().toString()
        };

        socket.emit('send_message', messageData);
    };

    const rollFormula = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implementar parser de fórmula real (ex: 2d20+5)
        // Por enquanto, apenas envia como texto
        if (!socket || !user || !customFormula) return;

        const messageData = {
            campaignId,
            content: `Rolou fórmula: ${customFormula} (Simulado)`,
            type: 'DICE_ROLL',
            user: {
                username: user.username,
                avatar: user.avatar
            },
            timestamp: new Date().toISOString(),
            id: Date.now().toString()
        };

        socket.emit('send_message', messageData);
        setCustomFormula('');
    };

    return (
        <div className="bg-navy-900 rounded-lg border border-gray-700 p-4">
            <h3 className="text-white font-semibold mb-3">Rolador de Dados</h3>

            <div className="grid grid-cols-4 gap-2 mb-4">
                {DICES.map((dice) => (
                    <button
                        key={dice.label}
                        onClick={() => rollDice(dice.value)}
                        className="bg-navy-800 hover:bg-primary-600 hover:text-white text-primary-400 border border-primary-500/30 rounded p-2 font-bold transition-colors"
                    >
                        {dice.label}
                    </button>
                ))}
            </div>

            <form onSubmit={rollFormula} className="flex gap-2">
                <input
                    type="text"
                    value={customFormula}
                    onChange={(e) => setCustomFormula(e.target.value)}
                    placeholder="Ex: 2d20+5"
                    className="flex-1 bg-navy-950 border border-gray-700 rounded px-3 py-1 text-white text-sm focus:border-primary-500 focus:outline-none"
                />
                <Button type="submit" className="text-sm py-1 px-3">
                    Rolar
                </Button>
            </form>
        </div>
    );
};
