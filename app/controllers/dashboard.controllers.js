import { apiFetch } from '../utils/api.js'

export const verDashboard = async (req, res) => {
    try {
        // El resumen (conteos para tarjetas y gráficos) y el listado se piden en paralelo
        const [reporte, listado] = await Promise.all([
            apiFetch(req, '/reporte'),
            apiFetch(req, '/documento')
        ])

        if (reporte.status === 401 || listado.status === 401) return res.redirect('/logout')
        if (!reporte.ok || !listado.ok) throw new Error('Error consultando documentos')

        const resumen = reporte.datos
        const porEstado = Object.fromEntries(resumen.porEstado.map(e => [e.etiqueta, e.total]))

        res.render('dashboard', {
            usuario: req.session.usuario,
            resumen,
            porEstado,
            recientes: listado.datos.slice(0, 5)
        })
    } catch {
        res.status(500).render('error', {
            usuario: req.session?.usuario,
            titulo: 'Error de conexión',
            mensaje: 'No fue posible obtener la información del backend.'
        })
    }
}
