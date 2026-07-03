import { apiFetch } from '../utils/api.js'

export const verDashboard = async (req, res) => {
    try {
        const { ok, status, datos: documentos } = await apiFetch(req, '/documento')

        if (status === 401) return res.redirect('/logout')
        if (!ok) throw new Error('Error consultando documentos')

        // Resumen por estado para las tarjetas del panel
        const resumen = { total: documentos.length }
        for (const doc of documentos) {
            resumen[doc.estado] = (resumen[doc.estado] || 0) + 1
        }

        res.render('dashboard', {
            usuario: req.session.usuario,
            resumen,
            recientes: documentos.slice(0, 5)
        })
    } catch {
        res.status(500).render('error', {
            usuario: req.session?.usuario,
            titulo: 'Error de conexión',
            mensaje: 'No fue posible obtener la información del backend.'
        })
    }
}
