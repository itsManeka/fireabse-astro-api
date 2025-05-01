# Firebase Astro API

[![Node.js](https://img.shields.io/badge/node-%3E%3D%2016.0.0-brightgreen)](https://nodejs.org/)  
[![Astrolink](https://img.shields.io/badge/astrolink-%40itsmaneka%2Fastrolink-blue)](https://www.npmjs.com/package/@itsmaneka/astrolink)  

Firebase Astro API é uma API construída com Node.js e Express que utiliza o Firebase Firestore para armazenar dados e o pacote [@itsmaneka/astrolink](https://www.npmjs.com/package/@itsmaneka/astrolink) para realizar cálculos de mapas astrais.

## Estrutura do Projeto

```
.
├── .env
├── .gitignore
├── firebase.js
├── index.js
├── package.json
├── routes/
│   └── mapa-astral.js
```

### Arquivos principais

- **`index.js`**: Configura o servidor Express, define as rotas e gerencia o CORS.
- **`firebase.js`**: Configura o Firebase Admin SDK para acessar o Firestore.
- **`routes/mapa-astral.js`**: Define a rota `/mapa-astral/calcular` para iniciar o calculo do mapa astral.

## Funcionalidades

- **Cálculo de Mapas Astrais**: Realiza cálculos de mapas astrais com base em data, hora e localização de nascimento.  
- **Armazenamento no Firebase**: Salva os resultados dos cálculos no Firestore.  
- **Notificações**: Registra notificações de sucesso ou erro no Firestore.  

## Requisitos

- Node.js >= 16.0.0  
- Firebase Firestore configurado  
- Conta no Firebase com permissões adequadas  

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/itsManeka/firebase-astro-api.git  
   cd firebase-astro-api  
   ```

2. Instale as dependências:

   ```bash
   npm install  
   ```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

   ```env
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
   FIREBASE_PROJECT_ID=seu-projeto-id
   FIREBASE_CLIENT_EMAIL=seu-email@projeto.iam.gserviceaccount.com
   URL_LOCAL=http://localhost:5173
   URL_OFICIAL=https://seu-site.com
   ```

- Certifique-se de que o arquivo `.env` está listado no `.gitignore` para evitar o upload de credenciais sensíveis.

4. Inicie o servidor:

    ```bash
    npm start  
    ```

## Uso

### Endpoint: `/calcular`

- **Método**: `POST`  
- **Descrição**: Inicia o cálculo de um mapa astral e retorna uma resposta imediata. O cálculo é processado de forma assíncrona, e os resultados são armazenados no Firestore.  

- **Headers**:  
  `Authorization: Bearer <token>`

#### Parâmetros esperados no corpo da requisição (`JSON`):

| Parâmetro | Tipo   | Obrigatório | Descrição                           |  
|-----------|--------|-------------|-------------------------------------|  
| `date`    | String | Sim         | Data de nascimento (YYYY-MM-DD).   |  
| `time`    | String | Sim         | Hora de nascimento (HH:mm:ss).     |  
| `lat`     | Number | Sim         | Latitude do local de nascimento.   |  
| `lng`     | Number | Sim         | Longitude do local de nascimento.  |  
| `name`    | String | Não         | Nome da pessoa (opcional).         |  

#### Exemplo de requisição:

```bash
curl -X POST http://localhost:3000/calcular \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <seu-token-de-autenticacao>" \
-d '{
  "date": "1990-01-01",
  "time": "12:00:00",
  "lat": -23.5505,
  "lng": -46.6333,
  "name": "João"
}'
```

#### Resposta:

- **202 Accepted**: Indica que o cálculo foi iniciado.  
  ```json
  {
    "message": "Cálculo iniciado. Você será notificado quando concluído."
  }
  ```

Os resultados serão armazenados no Firestore em:  
- Coleção: `mapa_astral`  
- Notificações: `notificacoes`  

## Dependências

- [Express](https://expressjs.com/)  
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)  
- [@itsmaneka/astrolink](https://www.npmjs.com/package/@itsmaneka/astrolink)