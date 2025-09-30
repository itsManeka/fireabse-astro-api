/**
 * Firebase Configuration
 * 
 * Este arquivo configura e inicializa o Firebase Admin SDK para acesso ao Firestore
 * e serviços de autenticação. As credenciais são carregadas das variáveis de ambiente
 * para manter a segurança.
 * 
 * @author Emanuel Ozorio
 * @version 1.0.0
 */

// Carrega as variáveis de ambiente
require('dotenv').config();

const admin = require('firebase-admin');

/**
 * Valida se todas as variáveis de ambiente necessárias estão definidas
 * @throws {Error} Se alguma variável obrigatória estiver ausente
 */
function validateEnvironmentVariables() {
    const requiredEnvVars = [
        'FIREBASE_PROJECT_ID',
        'FIREBASE_CLIENT_EMAIL',
        'FIREBASE_PRIVATE_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        throw new Error(`Variáveis de ambiente obrigatórias ausentes: ${missingVars.join(', ')}`);
    }
}

// Valida as variáveis de ambiente antes de inicializar
validateEnvironmentVariables();

/**
 * Inicializa o Firebase Admin SDK com as credenciais do service account
 * As credenciais são obtidas das variáveis de ambiente para segurança
 */
try {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Converte \\n em quebras de linha reais na chave privada
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        // Define configurações adicionais se necessário
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/`
    });

    console.log('✅ Firebase Admin SDK inicializado com sucesso');
} catch (error) {
    console.error('❌ Erro ao inicializar Firebase Admin SDK:', error.message);
    process.exit(1); // Encerra a aplicação se não conseguir conectar ao Firebase
}

/**
 * Instâncias dos serviços Firebase
 */
const db = admin.firestore();
const auth = admin.auth();

/**
 * Configurações do Firestore para melhor performance
 */
db.settings({
    ignoreUndefinedProperties: true, // Ignora propriedades undefined
});

/**
 * Exporta os serviços Firebase para uso em outros módulos
 * 
 * @exports admin - Instância principal do Firebase Admin SDK
 * @exports db - Cliente do Firestore para operações de banco de dados
 * @exports auth - Cliente de autenticação para validação de tokens
 */
module.exports = { admin, db, auth };