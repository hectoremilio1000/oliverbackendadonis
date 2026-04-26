import type { HttpContext } from '@adonisjs/core/http'
import Lead from '#models/lead'
import { createLeadValidator, updateLeadValidator } from '#validators/lead'

export default class LeadsController {
  // POST /api/leads (público, anti-spam con honeypot)
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createLeadValidator)

    // Honeypot: si viene relleno, es bot — devolvemos 200 para no dar pistas pero no guardamos
    if (data.honeypot && data.honeypot.length > 0) {
      return response.ok({ ok: true, id: 0, createdAt: new Date().toISOString() })
    }

    const lead = await Lead.create({
      nombre: data.nombre,
      empresa: data.empresa ?? null,
      email: data.email.toLowerCase(),
      telefono: data.telefono,
      tipo: data.tipo,
      etapa: data.etapa || null,
      mensaje: data.mensaje ?? null,
      status: 'new',
      ip: request.ip(),
      userAgent: request.header('user-agent') ?? null,
      utmSource: data.utm_source ?? null,
      utmMedium: data.utm_medium ?? null,
      utmCampaign: data.utm_campaign ?? null,
    })

    return response.created({ ok: true, id: lead.id, createdAt: lead.createdAt.toISO() })
  }

  // GET /api/leads (auth) — paginación + filtros
  async index({ request, response }: HttpContext) {
    const page = Math.max(1, Number(request.input('page', 1)))
    const perPage = Math.min(100, Math.max(1, Number(request.input('perPage', 20))))
    const status = request.input('status') as string | undefined
    const q = request.input('q') as string | undefined

    const query = Lead.query().orderBy('created_at', 'desc')
    if (status) query.where('status', status)
    if (q) {
      const like = `%${q.toLowerCase()}%`
      query.where((b) => {
        b.whereRaw('LOWER(nombre) LIKE ?', [like])
          .orWhereRaw('LOWER(email) LIKE ?', [like])
          .orWhereRaw('LOWER(empresa) LIKE ?', [like])
      })
    }

    const result = await query.paginate(page, perPage)
    return response.ok({
      data: result.all().map((l) => l.serialize()),
      meta: {
        total: result.total,
        page: result.currentPage,
        perPage: result.perPage,
        lastPage: result.lastPage,
      },
    })
  }

  // GET /api/leads/:id (auth)
  async show({ params, response }: HttpContext) {
    const lead = await Lead.find(params.id)
    if (!lead) return response.notFound({ error: 'Lead no encontrado' })
    return response.ok({ lead: lead.serialize() })
  }

  // PATCH /api/leads/:id (auth)
  async update({ params, request, response }: HttpContext) {
    const lead = await Lead.find(params.id)
    if (!lead) return response.notFound({ error: 'Lead no encontrado' })

    const data = await request.validateUsing(updateLeadValidator)
    if (data.status !== undefined) lead.status = data.status
    if (data.notes !== undefined) lead.notes = data.notes
    if (data.assigned_to !== undefined) lead.assignedTo = data.assigned_to

    await lead.save()
    return response.ok({ lead: lead.serialize() })
  }

  // DELETE /api/leads/:id (auth) — soft: status=lost
  async destroy({ params, response }: HttpContext) {
    const lead = await Lead.find(params.id)
    if (!lead) return response.notFound({ error: 'Lead no encontrado' })
    lead.status = 'lost'
    await lead.save()
    return response.ok({ ok: true })
  }
}
