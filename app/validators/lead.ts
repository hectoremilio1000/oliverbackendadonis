import vine from '@vinejs/vine'

const TIPOS = ['Restaurante', 'Hotel', 'Comedor industrial', 'Cafetería / Barra', 'Catering / Producción', 'Otro'] as const
const ETAPAS = ['Solo idea', 'Tengo plano / anteproyecto', 'Quiero remodelar', 'Quiero ampliar'] as const
const STATUS = ['new', 'contacted', 'qualified', 'won', 'lost'] as const

export const createLeadValidator = vine.compile(
  vine.object({
    nombre: vine.string().trim().minLength(1).maxLength(200),
    empresa: vine.string().trim().maxLength(200).optional(),
    email: vine.string().trim().email().maxLength(254),
    telefono: vine.string().trim().minLength(1).maxLength(50),
    tipo: vine.enum(TIPOS),
    etapa: vine.enum([...ETAPAS, '']).optional(),
    mensaje: vine.string().trim().maxLength(2000).optional(),
    honeypot: vine.string().maxLength(0).optional(),
    utm_source: vine.string().maxLength(100).optional(),
    utm_medium: vine.string().maxLength(100).optional(),
    utm_campaign: vine.string().maxLength(100).optional(),
  })
)

export const updateLeadValidator = vine.compile(
  vine.object({
    status: vine.enum(STATUS).optional(),
    notes: vine.string().trim().maxLength(5000).nullable().optional(),
    assigned_to: vine.number().positive().nullable().optional(),
  })
)
