import { apiFetch } from '../utils/api.js'

const CAMPOS = ['accion', 'usuario', 'desde', 'hasta']

// Fecha y hora de Colombia para mostrar en la bitácora
const formatoFecha = new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Bogota'
})

export const verAuditoria = async (req, res) => {
    try {
        const filtros = {}
        for (const campo of CAMPOS) {
            const valor = typeof req.query[campo] === 'string' ? req.query[campo].trim() : ''
            if (valor) filtros[campo] = valor
        }
        const pagina = Math.max(1, parseInt(req.query.pagina, 10) || 1)
        const consulta = new URLSearchParams({ ...filtros, pagina }).toString()

        const { ok, status, datos } = await apiFetch(req, `/auditoria?${consulta}`)

        if (status === 401) return res.redirect('/logout')
        if (!ok) throw new Error('Error consultando la auditoría')

        datos.registros.forEach(r => { r.fechaTexto = formatoFecha.format(new Date(r.fecha)) })

        res.render('auditoria/index', {
            usuario: req.session.usuario,
            ...datos,
            filtros,
            // Enlace de cada página conservando los filtros
            enlacePagina: (n) => `/auditoria?${new URLSearchParams({ ...filtros, pagina: n })}`
        })
    } catch {
        res.status(500).render('error', {
            usuario: req.session?.usuario,
            titulo: 'Error de conexión',
            mensaje: 'No fue posible obtener la bitácora de auditoría.'
        })
    }
}
