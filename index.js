/**
 * Firebase Astro API - Servidor principal
 * 
 * Este arquivo configura o servidor Express para a API de cálculo de mapas astrais,
 * integrando Firebase Firestore para armazenamento e autenticação.
 * 
 * @author Emanuel Ozorio
 * @version 1.0.0
 */

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Define as origens permitidas para CORS a partir das variáveis de ambiente
const allowedOrigins = [process.env.URL_LOCAL, process.env.URL_OFICIAL];

// Inicializa a aplicação Express
const app = express();

/**
 * Configuração do CORS (Cross-Origin Resource Sharing)
 * Permite requisições apenas das origens especificadas nas variáveis de ambiente
 */
app.use(cors({
    origin: function (origin, callback) {
        // Permite requisições sem origin (ex: aplicações mobile) ou das origens permitidas
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Acesso negado pelo CORS'));
        }
    },
    credentials: true // Permite o envio de cookies e cabeçalhos de autenticação
}));

// Middleware para parsing de JSON nas requisições
app.use(express.json({ limit: '10mb' }));

// Middleware para parsing de dados URL-encoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rota de health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Firebase Astro API'
    });
});

// Importa e configura as rotas de mapa astral
app.use('/mapa-astral', require('./routes/mapa-astral'));

// Middleware de tratamento de rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        path: req.originalUrl,
        method: req.method
    });
});

// Middleware global de tratamento de erros
app.use((error, req, res, next) => {
    console.error('Erro não tratado:', error);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
    });
});

// Define a porta do servidor
const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 API Firebase Astro rodando na porta ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🌟 Endpoint principal: http://localhost:${PORT}/mapa-astral/calcular`);
});