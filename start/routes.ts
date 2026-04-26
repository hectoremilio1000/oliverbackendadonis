import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const HealthController = () => import('#controllers/health_controller')
const AuthController = () => import('#controllers/auth_controller')
const LeadsController = () => import('#controllers/leads_controller')

router.get('/', async () => ({
  app: 'Oliver Cocina por Ti — Backend',
  status: 'ok',
  docs: '/api/health',
}))

router
  .group(() => {
    // Health (público)
    router.get('/health', [HealthController, 'show'])

    // Auth
    router.post('/auth/login', [AuthController, 'login'])
    router.post('/auth/logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('/auth/me', [AuthController, 'me']).use(middleware.auth())

    // Leads
    router.post('/leads', [LeadsController, 'store']) // público (form del sitio)
    router
      .group(() => {
        router.get('/leads', [LeadsController, 'index'])
        router.get('/leads/:id', [LeadsController, 'show'])
        router.patch('/leads/:id', [LeadsController, 'update'])
        router.delete('/leads/:id', [LeadsController, 'destroy'])
      })
      .use(middleware.auth())
  })
  .prefix('/api')
