# Oliver Cocina por Ti - Backend API

Backend REST API para Oliver Cocina por Ti, construido con Express, TypeScript, y listo para deployar en Railway.

## Stack Tecnológico

- **Framework**: Express.js
- **Language**: TypeScript
- **Runtime**: Node.js 22+
- **API Style**: REST JSON

## Setup Local

### 1. Requisitos

- Node.js >= 22.0.0
- npm o pnpm

### 2. Clonar e instalar

```bash
git clone https://github.com/hectoremilio1000/oliverbackendadonis.git
cd oliverbackendadonis
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

### 4. Compilar TypeScript

```bash
npm run build
```

### 5. Iniciar en desarrollo

```bash
npm run dev
```

Server corre en `http://localhost:3333`

## Endpoints

### Health

- **GET** `/api/health`
  - Respuesta: `{ ok: true, db: true, ts: "..." }`
  - Público

### Autenticación

- **POST** `/api/auth/login`
  - Body: `{ email, password }`
  - Respuesta: `{ ok: true, token, user: {...} }`

- **POST** `/api/auth/logout`
  - Headers: `Authorization: Bearer <token>`
  - Respuesta: `{ ok: true, message: "..." }`

- **GET** `/api/auth/me`
  - Headers: `Authorization: Bearer <token>`
  - Respuesta: `{ ok: true, user: {...} }`

### Leads

- **POST** `/api/leads` (Público)
  - Body: `{ nombre, email, telefono, tipo, empresa?, etapa?, mensaje?, honeypot?, utm_source?, utm_medium?, utm_campaign? }`
  - Respuesta: `{ ok: true, id, createdAt }`

- **GET** `/api/leads` (Autenticado)
  - Query: `page`, `limit`, `status`, `search`
  - Respuesta: Leads paginados

- **GET** `/api/leads/:id` (Autenticado)
  - Respuesta: Lead detallado

- **PATCH** `/api/leads/:id` (Autenticado)
  - Body: `{ status, notes, assigned_to_id }`
  - Respuesta: Lead actualizado

- **DELETE** `/api/leads/:id` (Autenticado)
  - Respuesta: Lead marcado como lost

## Comandos

```bash
npm run dev        # Desarrollo con hot reload
npm run build      # Compilar TypeScript
npm start          # Producción
npm test           # Tests (placeholder)
```

## Variables de Entorno

```
NODE_ENV=production
PORT=3333
HOST=0.0.0.0
ADMIN_EMAIL=admin@oliver.com
ADMIN_PASSWORD=<secure-password>
CORS_WHITELIST=https://olivercocinaporti.vercel.app
ADMIN_URL=https://admin.olivercocinaporti.com
DATABASE_URL=postgresql://...
```

## Deployment en Railway

Ver `DEPLOYMENT_RAILWAY.md`

## Estructura

```
.
├── src/
│   ├── server.ts         # Entry point
│   ├── controllers/
│   ├── models/
│   └── middleware/
├── build/                # Compiled (gitignored)
├── database/
├── package.json
└── tsconfig.json
```

## Notas

- Almacenamiento en memoria (demo)
- Tokens opacos (40 caracteres)
- CORS restrictivo
- Honeypot anti-spam

## Autor

Oliver Cocina por Ti - 2026
