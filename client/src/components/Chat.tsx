import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

interface Message {
    id: string;
    content: string;
    type: 'TEXT' | 'DICE_ROLL' | 'NARRATION';
    user: {
        username: string;
        avatar?: string;
    };
    timestamp: string;
}

interface ChatProps {
    campaignId: string;
}

export const Chat: React.FC<ChatProps> = ({ campaignId }) => {
    const { socket } = useSocket();
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!socket) return;

        socket.emit('join_room', campaignId);

        socket.on('receive_message', (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [socket, campaignId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !user) return;

        const messageData = {
            campaignId,
            content: newMessage,
            type: 'TEXT',
            user: {
                username: user.username,
                avatar: user.avatar
            },
            timestamp: new Date().toISOString(),
            id: Date.now().toString() // Temp ID
        };

        socket.emit('send_message', messageData);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-full bg-navy-900 rounded-lg border border-gray-700 overflow-hidden">
            <div className="bg-navy-950 p-3 border-b border-gray-700">
                <h3 className="text-white font-semibold">Chat da Sessão</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex flex-col ${msg.type === 'DICE_ROLL' ? 'items-center' : 'items-start'}`}>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-primary-400 font-bold text-sm">{msg.user.username}</span>
                            <span className="text-gray-600 text-xs">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        {msg.type === 'DICE_ROLL' ? (
                            <div className="bg-navy-800 border border-primary-500/50 rounded-lg p-3 text-center w-full">
                                <p className="text-gray-300 text-sm mb-1">Rolou dados</p>
                                <div className="text-white font-mono whitespace-pre-wrap">{msg.content}</div>
                            </div>
                        ) : (
                            <div className="bg-navy-800 rounded-lg p-2 px-3 text-gray-200 break-words max-w-full">
                                {msg.content}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-3 bg-navy-950 border-t border-gray-700 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 bg-navy-900 border border-gray-700 rounded px-3 py-2 text-white focus:border-primary-500 focus:outline-none"
                />
                <Button type="submit" className="px-4 py-2">
                    Enviar
                </Button>
            </form>
        </div>
    );
};
