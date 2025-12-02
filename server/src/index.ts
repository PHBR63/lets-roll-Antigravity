/**
 * Entry point do servidor Let's Roll
 * 
 * Este arquivo inicializa o Express, configura middlewares,
 * define rotas e inicia o servidor HTTP.
 * 
 * Criado para servir como base da API RESTful que será
 * consumida pelo frontend React.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middlewares
 * - cors: Permite requisições do frontend
 * - express.json: Parse de JSON no body das requisições
 */
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json());

/**
 * Rota de health check
 * Utilizada para verificar se o servidor está rodando
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
 * Retorna informações básicas da API
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
 * Inicia o servidor HTTP na porta especificada
 */
app.listen(PORT, () => {
    console.log(`🎲 Let's Roll API rodando na porta ${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
