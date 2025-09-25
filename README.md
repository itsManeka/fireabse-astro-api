# 🔮 Firebase Astro API

[![Node.js](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)  
[![Firebase](https://img.shields.io/badge/firebase-admin--13.3.0-orange)](https://firebase.google.com/)  
[![Astrolink](https://img.shields.io/badge/astrolink-%40itsmaneka%2Fastrolink-blue)](https://www.npmjs.com/package/@itsmaneka/astrolink)  
[![Express](https://img.shields.io/badge/express-5.1.0-lightgrey)](https://expressjs.com/)

**Firebase Astro API** é uma API REST robusta construída com Node.js e Express que integra Firebase Firestore para armazenamento de dados e utiliza o pacote [@itsmaneka/astrolink](https://www.npmjs.com/package/@itsmaneka/astrolink) para realizar cálculos precisos de mapas astrais.

## 📋 Índice

- [🔮 Firebase Astro API](#-firebase-astro-api)
  - [📋 Índice](#-índice)
  - [✨ Funcionalidades](#-funcionalidades)
  - [🏗️ Arquitetura e Estrutura](#️-arquitetura-e-estrutura)
    - [📁 Estrutura do Projeto](#-estrutura-do-projeto)
    - [📄 Descrição dos Arquivos](#-descrição-dos-arquivos)
  - [🔧 Requisitos Técnicos](#-requisitos-técnicos)
  - [⚡ Instalação e Configuração](#-instalação-e-configuração)
    - [1. Clone do Repositório](#1-clone-do-repositório)
    - [2. Instalação de Dependências](#2-instalação-de-dependências)
    - [3. Configuração das Variáveis de Ambiente](#3-configuração-das-variáveis-de-ambiente)
    - [4. Configuração do Firebase](#4-configuração-do-firebase)
    - [5. Execução da Aplicação](#5-execução-da-aplicação)
  - [📡 API Reference](#-api-reference)
    - [🔐 Autenticação](#-autenticação)
    - [🌟 Endpoints](#-endpoints)
      - [POST /mapa-astral/calcular](#post-mapa-astralcalcular)
      - [GET /mapa-astral/status](#get-mapa-astralstatus)
      - [GET /health](#get-health)
  - [🔒 Segurança](#-segurança)
  - [🏗️ Estrutura do Firestore](#️-estrutura-do-firestore)
  - [🚀 Deploy](#-deploy)
    - [Variáveis de Ambiente para Produção](#variáveis-de-ambiente-para-produção)
  - [🧪 Testes e Validação](#-testes-e-validação)
  - [⚠️ Tratamento de Erros](#️-tratamento-de-erros)
  - [📊 Monitoramento e Logs](#-monitoramento-e-logs)
  - [🔄 Contribuição](#-contribuição)
  - [📦 Dependências](#-dependências)
  - [👤 Autor](#-autor)

## ✨ Funcionalidades

- 🌟 **Cálculo de Mapas Astrais**: Processamento assíncrono de mapas astrais com alta precisão
- 🔐 **Autenticação Firebase**: Segurança robusta com tokens JWT do Firebase Auth
- 📱 **API RESTful**: Interface padronizada e bem documentada
- ☁️ **Armazenamento em Nuvem**: Persistência segura no Firebase Firestore
- 📬 **Sistema de Notificações**: Notificações automáticas de status para usuários
- ✅ **Validação Rigorosa**: Validação completa de dados de entrada
- 🚨 **Tratamento de Erros**: Sistema robusto de tratamento e logging de erros
- 🌐 **CORS Configurado**: Suporte a múltiplas origens com segurança
- 📊 **Monitoramento**: Health checks e status de processamento
- ⚡ **Performance**: Processamento não-bloqueante e otimizado

## 🏗️ Arquitetura e Estrutura

### 📁 Estrutura do Projeto

```
firebase-astro-api/
├── 📄 package.json              # Configurações e dependências do Node.js
├── 📄 package-lock.json         # Lock de versões das dependências
├── 📄 README.md                 # Documentação do projeto
├── 🔧 .env                      # Variáveis de ambiente (não versionado)
├── 📄 .gitignore                # Arquivos ignorados pelo Git
├── 🚀 index.js                  # Servidor principal Express
├── 🔥 firebase.js               # Configuração do Firebase Admin SDK
└── 📁 routes/
    └── 🌟 mapa-astral.js         # Rotas de cálculo de mapa astral
```

### 📄 Descrição dos Arquivos

| Arquivo | Descrição | Responsabilidades |
|---------|-----------|-------------------|
| **`index.js`** | Servidor principal Express | • Configuração do servidor<br>• Middleware CORS<br>• Roteamento principal<br>• Tratamento global de erros |
| **`firebase.js`** | Configuração Firebase | • Inicialização do Admin SDK<br>• Validação de credenciais<br>• Configuração do Firestore |
| **`routes/mapa-astral.js`** | Lógica de negócio | • Autenticação de usuários<br>• Validação de dados<br>• Processamento assíncrono<br>• Gerenciamento de notificações |

## 🔧 Requisitos Técnicos

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **Firebase Project**: Projeto configurado no Firebase Console
- **Firestore**: Database Firestore ativo
- **Firebase Auth**: Serviço de autenticação habilitado

## ⚡ Instalação e Configuração

### 1. Clone do Repositório

```bash
git clone https://github.com/itsManeka/firebase-astro-api.git
cd firebase-astro-api
```

### 2. Instalação de Dependências

```bash
npm install
```

### 3. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# 🔥 Configurações do Firebase
FIREBASE_PROJECT_ID=seu-projeto-firebase-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----"

# 🌐 URLs permitidas para CORS
URL_LOCAL=http://localhost:5173
URL_OFICIAL=https://seu-dominio.com

# 🚀 Porta do servidor (opcional)
PORT=3000

# 🛠️ Ambiente de execução (opcional)
NODE_ENV=development
```

> ⚠️ **Importante**: Mantenha o arquivo `.env` no `.gitignore` para proteger suas credenciais!

### 4. Configuração do Firebase

1. **Criar Service Account**:
   - Acesse o [Firebase Console](https://console.firebase.google.com/)
   - Vá para Project Settings > Service Accounts
   - Clique em "Generate new private key"
   - Baixe o arquivo JSON e extraia as informações para o `.env`

2. **Configurar Firestore**:
   - Ative o Firestore Database
   - Configure as regras de segurança conforme necessário

3. **Configurar Authentication**:
   - Ative os métodos de autenticação desejados
   - Configure os domínios autorizados

### 5. Execução da Aplicação

```bash
# 🚀 Modo desenvolvimento
npm start

# 🔧 Modo desenvolvimento com watch (opcional)
npm run dev  # Se configurado
```

A API estará disponível em: `http://localhost:3000`

## 📡 API Reference

### 🔐 Autenticação

Todas as rotas (exceto `/health`) requerem autenticação via Firebase Auth Token:

```http
Authorization: Bearer <firebase_id_token>
```

### 🌟 Endpoints

#### POST /mapa-astral/calcular

Inicia o cálculo assíncrono de um mapa astral.

**📋 Parâmetros de Entrada:**

| Campo | Tipo | Obrigatório | Validação | Descrição |
|-------|------|-------------|-----------|-----------|
| `date` | String | ✅ | `YYYY-MM-DD` | Data de nascimento |
| `time` | String | ✅ | `HH:mm:ss` | Hora de nascimento |
| `lat` | Number | ✅ | `-90` a `90` | Latitude do local |
| `lng` | Number | ✅ | `-180` a `180` | Longitude do local |
| `name` | String | ❌ | String válida | Nome da pessoa |

**📝 Exemplo de Requisição:**

```bash
curl -X POST https://sua-api.com/mapa-astral/calcular \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ..." \
  -d '{
    "date": "1990-01-01",
    "time": "12:00:00",
    "lat": -23.5505,
    "lng": -46.6333,
    "name": "João Silva"
  }'
```

**✅ Resposta de Sucesso (202):**

```json
{
  "message": "Cálculo do mapa astral iniciado com sucesso! Você será notificado quando concluído.",
  "status": "processing",
  "estimatedTime": "2-5 minutos"
}
```

**❌ Resposta de Erro (400):**

```json
{
  "error": "Dados inválidos",
  "details": [
    "Data deve estar no formato YYYY-MM-DD",
    "Latitude deve ser um número entre -90 e 90"
  ]
}
```

#### GET /mapa-astral/status

Consulta o status do último cálculo de mapa astral do usuário autenticado.

**✅ Resposta de Sucesso (200):**

```json
{
  "status": "completed",
  "createdAt": "2024-01-15T10:30:00Z",
  "hasResult": true,
  "error": null
}
```

**❌ Resposta - Não Encontrado (404):**

```json
{
  "message": "Nenhum cálculo de mapa astral encontrado"
}
```

#### GET /health

Health check da aplicação (não requer autenticação).

**✅ Resposta (200):**

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "Firebase Astro API"
}
```

## 🔒 Segurança

- **🔐 Autenticação JWT**: Tokens Firebase validados em cada requisição
- **🌐 CORS Restritivo**: Apenas origens configuradas são permitidas
- **🛡️ Validação de Entrada**: Sanitização rigorosa de todos os dados
- **🔒 Variáveis Seguras**: Credenciais isoladas em variáveis de ambiente
- **📊 Rate Limiting**: Implementar conforme necessário (recomendado)

## 🏗️ Estrutura do Firestore

```
users/
└── {uid}/
    ├── mapa_astral/
    │   └── data/
    │       ├── date: string
    │       ├── time: string
    │       ├── lat: number
    │       ├── lng: number
    │       ├── name?: string
    │       ├── mapa: object
    │       ├── status: "processing" | "completed" | "error"
    │       ├── error?: string
    │       └── createdAt: timestamp
    └── notifications/
        └── {auto-id}/
            ├── title: string
            ├── message: string
            ├── type: "success" | "error"
            ├── read: boolean
            └── createdAt: timestamp
```

## 🚀 Deploy

Para deploy em produção, recomenda-se:

### Variáveis de Ambiente para Produção

```env
NODE_ENV=production
PORT=443
FIREBASE_PROJECT_ID=seu-projeto-prod
FIREBASE_CLIENT_EMAIL=prod-service-account@projeto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
URL_OFICIAL=https://seu-dominio-prod.com
```

**Plataformas Recomendadas:**
- 🌐 Render
- 🌐 Vercel
- 🚀 Railway
- ☁️ Google Cloud Run
- 🔥 Firebase Functions
- 📦 Docker Container

## 🧪 Testes e Validação

Para testar a API localmente:

```bash
# Test de health check
curl http://localhost:3000/health

# Test de autenticação (substitua pelo token real)
curl -X POST http://localhost:3000/mapa-astral/calcular \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"date":"1990-01-01","time":"12:00:00","lat":-23.5505,"lng":-46.6333}'
```

## ⚠️ Tratamento de Erros

A API implementa tratamento robusto de erros:

| Código | Descrição | Causa |
|--------|-----------|-------|
| **400** | Bad Request | Dados inválidos ou malformados |
| **401** | Unauthorized | Token ausente ou inválido |
| **404** | Not Found | Recurso não encontrado |
| **500** | Internal Server Error | Erro interno do servidor |

## 📊 Monitoramento e Logs

- **✅ Health Checks**: Endpoint `/health` para monitoramento
- **📝 Logs Estruturados**: Console logs com emojis e timestamps
- **🔍 Error Tracking**: Logs detalhados de erros com stack traces
- **📈 Performance**: Logs de tempo de processamento

## 🔄 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📦 Dependências

### Principais

| Dependência | Versão | Descrição |
|-------------|--------|-----------|
| **express** | ^5.1.0 | Framework web Node.js |
| **firebase-admin** | ^13.3.0 | SDK Admin do Firebase |
| **@itsmaneka/astrolink** | ^1.2.2 | Biblioteca de cálculos astrológicos |
| **cors** | ^2.8.5 | Middleware CORS para Express |
| **dotenv** | ^16.5.0 | Carregamento de variáveis de ambiente |
| **node-fetch** | ^3.3.2 | Cliente HTTP para Node.js |

### Desenvolvimento (Recomendadas)

```bash
npm install --save-dev nodemon jest supertest
```

## 👤 Autor

**Emanuel Ozorio**
- GitHub: [@itsManeka](https://github.com/itsManeka)
- Email: [emanuel.ozoriodias@gmail.com](mailto:emanuel.ozoriodias@gmail.com)

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

Made with ❤️ and ☕ by [Emanuel Ozorio](https://github.com/itsManeka)

</div>