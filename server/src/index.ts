/**
 * Entry point do servidor Let's Roll
 * 
 * Este arquivo inicializa o Express, configura middlewares,
 * define rotas e inicia o servidor HTTP.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import campaignRoutes from './routes/campaignRoutes';
import characterRoutes from './routes/characterRoutes';

// Carregar variáveis de ambiente
dotenv.config();

import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const PORT = process.env.PORT || 3000;

/**
 * Middlewares globais
 */
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

/**
 * Socket.io Events
 */
io.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
});

/**
 * Rotas da API
 */
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/characters', characterRoutes);

/**
 * Health check
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Let\'s Roll API is running!',
        timestamp: new Date().toISOString()
    });
});

/**
 * Rota raiz
 */
app.get('/', (req, res) => {
    res.json({
        name: 'Let\'s Roll API',
        version: '1.0.0',
        description: 'API para plataforma de RPG de mesa online'
    });
});

/**
 * Inicialização do servidor
 */
httpServer.listen(PORT, () => {
    console.log(`🎲 Let's Roll API rodando na porta ${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
