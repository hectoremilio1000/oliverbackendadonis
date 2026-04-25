# Deployment en Railway

Guía para deployar Oliver Backend API en Railway.

## Prerequisitos

- Repo: https://github.com/hectoremilio1000/oliverbackendadonis
- Cuenta Railway: https://railway.app
- Proyecto: "shimmering-magic" con PostgreSQL

## Pasos Rápidos

1. **Login en Railway** → https://railway.app
2. **Ir a proyecto "shimmering-magic"**
3. **Click "New" → "GitHub Repo"**
4. **Seleccionar** `hectoremilio1000/oliverbackendadonis`
5. **Esperar a que compile** (2-3 minutos)

## Configurar Variables

En Dashboard → tu servicio Node.js → Variables:

```
NODE_ENV=production
PORT=3333
HOST=0.0.0.0
ADMIN_EMAIL=admin@oliver.com
ADMIN_PASSWORD=<tu-contraseña-segura>
CORS_WHITELIST=https://olivercocinaporti.vercel.app
ADMIN_URL=https://admin.olivercocinaporti.com
DATABASE_URL=<auto-inyectado por Railway>
```

## Verificar Deployment

```bash
curl https://<tu-url-railway>/api/health
# Respuesta: {"ok": true, "db": true, "ts": "..."}
```

## Test Login

```bash
curl -X POST https://<tu-url-railway>/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@oliver.com", "password": "<password>"}'
```

## Troubleshooting

**Build falla:**
- Revisar logs en Railway dashboard
- Verificar que `npm run build` funciona localmente

**Servidor no arranca:**
- Revisar que PORT está en 3333
- Verificar que HOST es 0.0.0.0
- Ver logs: Dashboard → Logs

## URLs Útiles

- Dashboard: https://railway.app
- Logs: Dashboard → tu servicio → Logs

