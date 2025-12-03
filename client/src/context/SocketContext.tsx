import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextData {
    socket: Socket | null;
    connected: boolean;
}

const SocketContext = createContext<SocketContextData>({
    socket: null,
    connected: false
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setConnected(false);
            }
            return;
        }

        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
            withCredentials: true,
            autoConnect: true
        });

        newSocket.on('connect', () => {
            console.log('🔌 Socket conectado:', newSocket.id);
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Socket desconectado');
            setConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
