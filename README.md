# oliverbackendadonis

Backend API para Oliver Cocina por Ti — recibe leads del formulario público y expone CRUD para el panel admin.

## Stack

- **AdonisJS 6** (TypeScript ESM, Pages Router-style con import aliases `#controllers/*`)
- **Lucid ORM** sobre PostgreSQL (con SQLite fallback para dev local sin docker)
- **@adonisjs/auth** con `access_tokens` (Bearer opaque)
- **@adonisjs/cors** con whitelist por env var
- **VineJS** para validación
- **Japa** para tests (no incluidos en MVP)

## Endpoints

| Verbo | Path | Auth | Descripción |
|---|---|---|---|
| GET | `/` | no | Banner del API |
| GET | `/api/health` | no | Healthcheck (incluye estado de DB) |
| POST | `/api/auth/login` | no | `{ email, password }` → `{ token, user }` |
| POST | `/api/auth/logout` | Bearer | Revoca el token actual |
| GET | `/api/auth/me` | Bearer | Datos del usuario logueado |
| POST | `/api/leads` | no | Crea lead desde el formulario público (anti-spam con honeypot) |
| GET | `/api/leads` | Bearer | Lista paginada (`?page=1&perPage=20&status=new&q=texto`) |
| GET | `/api/leads/:id` | Bearer | Detalle |
| PATCH | `/api/leads/:id` | Bearer | Update `{ status, notes, assigned_to }` |
| DELETE | `/api/leads/:id` | Bearer | Soft delete (status=lost) |

## Setup local (sin Docker)

```bash
git clone https://github.com/hectoremilio1000/oliverbackendadonis.git
cd oliverbackendadonis
npm install
cp .env.example .env
# Generar APP_KEY si está vacío:
node ace generate:key
# Si no seteas DATABASE_URL en dev, usa SQLite automáticamente en tmp/db.sqlite3

node ace migration:run
node ace db:seed
node ace serve --hmr
```

API en `http://localhost:3333`. Login default:

```
admin@oliver.com / cambiame123
```

(personalizables vía `ADMIN_EMAIL` y `ADMIN_PASSWORD` antes de seedear)

## Variables de entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `NODE_ENV` | sí | `development` / `production` / `test` |
| `PORT` | sí | Puerto (Railway lo inyecta) |
| `HOST` | sí | `0.0.0.0` en producción |
| `APP_KEY` | sí | 32+ caracteres aleatorios. Generar: `node ace generate:key` |
| `APP_URL` | sí | URL pública del backend |
| `SESSION_DRIVER` | sí | `cookie` (default) |
| `DATABASE_URL` | en prod | Postgres URL completa. En dev local opcional (cae a SQLite) |
| `CORS_ORIGIN` | recomendado | Coma-separados: `https://olivercocinaporti.vercel.app,https://admin...vercel.app` |
| `ADMIN_EMAIL` | opcional | Default `admin@oliver.com` (para seeder) |
| `ADMIN_PASSWORD` | opcional | Default `cambiame123` (para seeder) |
| `ADMIN_FULL_NAME` | opcional | Default `Admin Oliver` |

## Deployment a Railway

1. Entra a https://railway.com → tu proyecto **shimmering-magic**
2. Click **+ New** → **GitHub Repo** → `hectoremilio1000/oliverbackendadonis`
3. Railway detectará el `Dockerfile` y `railway.json` automáticamente
4. En **Variables** del servicio nuevo agrega:
   ```
   NODE_ENV=production
   PORT=3333
   HOST=0.0.0.0
   APP_KEY=<generar con: node ace generate:key>
   APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
   SESSION_DRIVER=cookie
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   CORS_ORIGIN=https://olivercocinaporti.vercel.app,https://administrador-oliver-front.vercel.app
   ADMIN_EMAIL=admin@oliver.com
   ADMIN_PASSWORD=<algo seguro>
   ADMIN_FULL_NAME=Admin Oliver
   ```
5. Linkea el servicio Postgres existente al nuevo servicio (Railway expone `Postgres.DATABASE_URL` automáticamente)
6. Deploy. El Dockerfile corre `node ace migration:run --force` antes de arrancar el servidor.
7. Después del primer deploy, ejecuta el seeder UNA VEZ:
   ```
   railway run node ace db:seed
   ```
   (o vía Railway shell)
8. Healthcheck en `https://<tu-url>/api/health` debe devolver `{ ok: true, db: true }`

## Estructura

```
app/
├── controllers/         auth_controller.ts, leads_controller.ts, health_controller.ts
├── middleware/          auth_middleware.ts (default scaffold)
├── models/              user.ts, lead.ts
└── validators/          auth.ts, lead.ts
config/
├── auth.ts              guard 'api' con access_tokens
├── cors.ts              whitelist desde CORS_ORIGIN env var
└── database.ts          postgres prod / sqlite dev
database/
├── migrations/          users + access_tokens + add_role_active + leads
├── seeders/             admin_seeder.ts
└── schema.ts            (auto-generado, no editar)
start/
├── env.ts               validador de env
├── kernel.ts            middleware stack
└── routes.ts            todas las rutas API
Dockerfile               multi-stage para Railway
railway.json             healthcheck + restart policy
```

## Comandos útiles

```bash
node ace serve --hmr           # dev
node ace build                 # production build
node ace migration:run         # corre migrations pendientes
node ace migration:rollback    # rollback ultima batch
node ace db:seed               # corre todos los seeders
node ace make:controller foo   # genera controller
node ace make:model Foo -m     # genera model + migration
node ace test                  # corre tests Japa (sin tests en MVP)
```

## Roadmap

- CRUD de Projects (alimenta `/proyectos` del sitio público)
- CRUD de Services
- CRUD de Site config (CONTACT, SOCIAL)
- Upload de imágenes (S3 / R2 / Backblaze)
- Notificaciones email (Resend) y WhatsApp Business al recibir lead
- Tests Japa de los endpoints críticos
- Rate limit en POST /api/leads
- 2FA admin
