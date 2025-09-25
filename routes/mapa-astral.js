/**
 * Rotas para Cálculo de Mapa Astral
 * 
 * Este módulo define as rotas relacionadas ao cálculo de mapas astrais,
 * incluindo autenticação de usuários, validação de dados e armazenamento
 * dos resultados no Firebase Firestore.
 * 
 * @author Emanuel Ozorio
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const { db, admin, auth } = require('../firebase');
const astrolink = require('@itsmaneka/astrolink');

/**
 * Middleware de autenticação - Verifica e valida o token Firebase
 * 
 * @param {Object} req - Objeto de requisição Express
 * @returns {Promise<string>} - UID do usuário autenticado
 * @throws {Error} - Erro de autenticação se token inválido ou ausente
 */
async function verifyUser(req) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Token de autorização ausente ou formato inválido');
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
        throw new Error('Token de autorização não fornecido');
    }
    
    try {
        const decoded = await auth.verifyIdToken(token);
        return decoded.uid;
    } catch (error) {
        throw new Error(`Token inválido: ${error.message}`);
    }
}

/**
 * Valida os dados de entrada para cálculo do mapa astral
 * 
 * @param {Object} data - Dados de entrada
 * @param {string} data.date - Data no formato YYYY-MM-DD
 * @param {string} data.time - Hora no formato HH:mm:ss
 * @param {number} data.lat - Latitude (-90 a 90)
 * @param {number} data.lng - Longitude (-180 a 180)
 * @returns {Object} - Objeto com dados validados ou erros
 */
function validateInputData({ date, time, lat, lng, name }) {
    const errors = [];
    
    // Validação de data
    if (!date) {
        errors.push('Data de nascimento é obrigatória');
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        errors.push('Data deve estar no formato YYYY-MM-DD');
    }
    
    // Validação de hora
    if (!time) {
        errors.push('Hora de nascimento é obrigatória');
    } else if (!/^\d{2}:\d{2}:\d{2}$/.test(time)) {
        errors.push('Hora deve estar no formato HH:mm:ss');
    }
    
    // Validação de latitude
    if (lat === null || lat === undefined) {
        errors.push('Latitude é obrigatória');
    } else if (typeof lat !== 'number' || lat < -90 || lat > 90) {
        errors.push('Latitude deve ser um número entre -90 e 90');
    }
    
    // Validação de longitude
    if (lng === null || lng === undefined) {
        errors.push('Longitude é obrigatória');
    } else if (typeof lng !== 'number' || lng < -180 || lng > 180) {
        errors.push('Longitude deve ser um número entre -180 e 180');
    }
    
    // Validação de nome (opcional, mas se fornecido deve ser válido)
    if (name && (typeof name !== 'string' || name.trim().length < 1)) {
        errors.push('Nome deve ser uma string não vazia se fornecido');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        data: { 
            date, 
            time, 
            lat: parseFloat(lat), 
            lng: parseFloat(lng), 
            name: name?.trim() || null 
        }
    };
}

/**
 * Salva ou atualiza dados do mapa astral no Firestore
 * 
 * @param {string} collection - Nome da coleção principal
 * @param {string} subcollection - Nome da subcoleção
 * @param {Object} values - Dados a serem salvos
 * @param {string} uid - ID do usuário
 * @returns {Promise<void>}
 */
async function fireSet(collection, subcollection, values, uid) {
    try {
        const ref = db.collection(collection).doc(uid).collection(subcollection).doc('data');
        await ref.set(values, { merge: true });
        console.log(`✅ Dados salvos com sucesso em ${collection}/${uid}/${subcollection}`);
    } catch (error) {
        console.error(`❌ Erro ao salvar em ${collection}/${subcollection}:`, error);
        throw error;
    }
}

/**
 * Adiciona uma nova notificação ao Firestore
 * 
 * @param {string} collection - Nome da coleção principal
 * @param {string} subcollection - Nome da subcoleção
 * @param {Object} values - Dados da notificação
 * @param {string} uid - ID do usuário
 * @returns {Promise<void>}
 */
async function fireAdd(collection, subcollection, values, uid) {
    try {
        const ref = db.collection(collection).doc(uid).collection(subcollection);
        await ref.add(values);
        console.log(`✅ Notificação adicionada para usuário ${uid}`);
    } catch (error) {
        console.error(`❌ Erro ao adicionar notificação:`, error);
        throw error;
    }
}

/**
 * Processa o cálculo do mapa astral de forma assíncrona
 * 
 * @param {Object} data - Dados validados para o cálculo
 * @param {string} uid - ID do usuário
 */
async function processarMapaAstral(data, uid) {
    try {
        console.log(`🔮 Iniciando cálculo do mapa astral para usuário ${uid}`);
        
        // Calcula o mapa astral usando a biblioteca astrolink
        const mapa = await astrolink.calcularMapaAstral(data);
        
        // Salva o resultado no Firestore
        await fireSet('users', 'mapa_astral', {
            ...data,
            mapa,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'completed'
        }, uid);
        
        // Envia notificação de sucesso
        await fireAdd('users', 'notifications', {
            title: 'Mapa Astral Calculado',
            message: 'O cálculo do seu mapa astral está pronto! Acesse o menu Astrologia para visualizar o resultado.',
            type: 'success',
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }, uid);
        
        console.log(`✅ Mapa astral calculado com sucesso para usuário ${uid}`);
        
    } catch (error) {
        console.error(`❌ Erro ao processar mapa astral para usuário ${uid}:`, error);
        
        // Envia notificação de erro
        await fireAdd('users', 'notifications', {
            title: 'Erro no Cálculo do Mapa Astral',
            message: 'Ocorreu um erro ao calcular seu mapa astral. Tente novamente mais tarde ou entre em contato com o suporte.',
            type: 'error',
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }, uid);
    }
}

/**
 * Endpoint POST /calcular
 * 
 * Inicia o cálculo de um mapa astral de forma assíncrona
 * Retorna uma resposta imediata e processa o cálculo em background
 * 
 * @route POST /mapa-astral/calcular
 * @access Privado (requer autenticação Firebase)
 */
router.post("/calcular", async (req, res) => {
    let uid = null;
    
    try {
        // 1. Verifica autenticação do usuário
        uid = await verifyUser(req);
        
        // 2. Valida os dados de entrada
        const validation = validateInputData(req.body);
        
        if (!validation.isValid) {
            return res.status(400).json({
                error: 'Dados inválidos',
                details: validation.errors
            });
        }
        
        // 3. Responde imediatamente ao cliente
        res.status(202).json({
            message: 'Cálculo do mapa astral iniciado com sucesso! Você será notificado quando concluído.',
            status: 'processing',
            estimatedTime: '2-5 minutos'
        });
        
        // 4. Processa o cálculo de forma assíncrona (não bloqueia a resposta)
        setImmediate(() => {
            processarMapaAstral(validation.data, uid);
        });
        
    } catch (error) {
        console.error('Erro no endpoint /calcular:', error);
        
        // Trata diferentes tipos de erro
        if (error.message.includes('Token') || error.message.includes('Unauthorized')) {
            return res.status(401).json({
                error: 'Não autorizado',
                message: 'Token de autenticação inválido ou ausente'
            });
        }
        
        // Erro interno do servidor
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Ocorreu um erro inesperado. Tente novamente mais tarde.'
        });
        
        // Se temos o UID, envia notificação de erro
        if (uid) {
            try {
                await fireAdd('users', 'notifications', {
                    title: 'Erro no Sistema',
                    message: 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.',
                    type: 'error',
                    read: false,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                }, uid);
            } catch (notificationError) {
                console.error('Erro ao enviar notificação de erro:', notificationError);
            }
        }
    }
});

/**
 * Endpoint GET /status/:uid
 * 
 * Consulta o status do último cálculo de mapa astral do usuário
 * 
 * @route GET /mapa-astral/status
 * @access Privado (requer autenticação Firebase)
 */
router.get("/status", async (req, res) => {
    try {
        const uid = await verifyUser(req);
        
        const doc = await db.collection('users').doc(uid).collection('mapa_astral').doc('data').get();
        
        if (!doc.exists) {
            return res.status(404).json({
                message: 'Nenhum cálculo de mapa astral encontrado'
            });
        }
        
        const data = doc.data();
        res.json({
            status: data.status || 'unknown',
            createdAt: data.createdAt,
            hasResult: !!data.mapa,
            error: data.error || null
        });
        
    } catch (error) {
        console.error('Erro ao consultar status:', error);
        
        if (error.message.includes('Token') || error.message.includes('Unauthorized')) {
            return res.status(401).json({
                error: 'Não autorizado',
                message: 'Token de autenticação inválido ou ausente'
            });
        }
        
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Não foi possível consultar o status'
        });
    }
});

module.exports = router;