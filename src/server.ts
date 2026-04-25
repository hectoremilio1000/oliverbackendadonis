import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = parseInt(process.env.PORT || '3333', 10)
const HOST = process.env.HOST || '0.0.0.0'

// Middleware
app.use(express.json())
app.use(cors({
  origin: (process.env.CORS_WHITELIST || 'http://localhost:3333').split(','),
  credentials: true,
}))

// Storage en memoria (para demostración)
const users: any[] = []
const leads: any[] = []
const tokens = new Map<string, any>()

// Rutas

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ ok: true, db: true, ts: new Date().toISOString() })
})

// Root
app.get('/', (req: Request, res: Response) => {
  res.json({ app: 'Oliver Backend API', version: '1.0.0' })
})

// Auth
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }
  
  const user = users.find(u => u.email === email)
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  
  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  
  const token = Math.random().toString(36).substring(2, 42)
  tokens.set(token, user.id)
  
  res.json({
    ok: true,
    token,
    user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
  })
})

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (token) tokens.delete(token)
  res.json({ ok: true, message: 'Logged out successfully' })
})

app.get('/api/auth/me', (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token || !tokens.has(token)) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  
  const userId = tokens.get(token)
  const user = users.find(u => u.id === userId)
  
  res.json({
    ok: true,
    user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
  })
})

// Leads (público)
app.post('/api/leads', (req: Request, res: Response) => {
  const { nombre, empresa, email, telefono, tipo, etapa, mensaje, honeypot, utm_source, utm_medium, utm_campaign } = req.body
  
  if (honeypot && honeypot !== '') {
    return res.status(400).json({ error: 'Invalid submission' })
  }
  
  if (!nombre || !email || !telefono || !tipo) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  
  const lead = {
    id: leads.length + 1,
    nombre,
    empresa: empresa || null,
    email,
    telefono,
    tipo,
    etapa: etapa || null,
    mensaje: mensaje || null,
    status: 'new',
    notes: null,
    assignedToId: null,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    utmSource: utm_source || null,
    utmMedium: utm_medium || null,
    utmCampaign: utm_campaign || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  leads.push(lead)
  
  res.status(201).json({
    ok: true,
    id: lead.id,
    createdAt: lead.createdAt,
  })
})

// Leads (autenticado)
app.get('/api/leads', (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token || !tokens.has(token)) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  
  const page = parseInt(req.query.page as string || '1', 10)
  const limit = parseInt(req.query.limit as string || '20', 10)
  const status = req.query.status as string
  const search = req.query.search as string
  
  let filtered = leads
  if (status) filtered = filtered.filter(l => l.status === status)
  if (search) filtered = filtered.filter(l => l.nombre.includes(search) || l.email.includes(search))
  
  const start = (page - 1) * limit
  const paginated = filtered.slice(start, start + limit)
  
  res.json({
    ok: true,
    data: paginated,
    pagination: {
      total: filtered.length,
      perPage: limit,
      currentPage: page,
      lastPage: Math.ceil(filtered.length / limit),
    },
  })
})

app.get('/api/leads/:id', (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token || !tokens.has(token)) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  
  const lead = leads.find(l => l.id === parseInt(req.params.id, 10))
  if (!lead) {
    return res.status(404).json({ error: 'Lead not found' })
  }
  
  res.json({ ok: true, data: lead })
})

app.patch('/api/leads/:id', (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token || !tokens.has(token)) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  
  const lead = leads.find(l => l.id === parseInt(req.params.id, 10))
  if (!lead) {
    return res.status(404).json({ error: 'Lead not found' })
  }
  
  if (req.body.status) lead.status = req.body.status
  if (req.body.notes !== undefined) lead.notes = req.body.notes
  if (req.body.assigned_to_id !== undefined) lead.assignedToId = req.body.assigned_to_id
  lead.updatedAt = new Date()
  
  res.json({ ok: true, data: lead })
})

app.delete('/api/leads/:id', (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token || !tokens.has(token)) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  
  const lead = leads.find(l => l.id === parseInt(req.params.id, 10))
  if (!lead) {
    return res.status(404).json({ error: 'Lead not found' })
  }
  
  lead.status = 'lost'
  lead.updatedAt = new Date()
  
  res.json({ ok: true, message: 'Lead marked as lost' })
})

// Init
const initializeData = () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@oliver.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'cambiame123'
  
  users.push({
    id: 1,
    email: adminEmail,
    password: adminPassword,
    fullName: 'Admin Oliver',
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  
  console.log(`Admin user created: ${adminEmail}`)
}

initializeData()

app.listen(PORT, HOST, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`)
})

export default app
