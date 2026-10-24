import { apiFetch, apiDescargar, leerFiltros, consultaFiltros } from '../utils/api.js'

export const verReportes = async (req, res) => {
    try {
        const filtros = leerFiltros(req.query)
        const { ok, status, datos: reporte } = await apiFetch(req, `/reporte${consultaFiltros(filtros)}`)

        if (status === 401) return res.redirect('/logout')
        if (!ok) throw new Error('Error consultando el reporte')

        res.render('reportes/index', {
            usuario: req.session.usuario,
            reporte,
            filtros,
            consulta: consultaFiltros(filtros)
        })
    } catch {
        res.status(500).render('error', {
            usuario: req.session?.usuario,
            titulo: 'Error de conexión',
            mensaje: 'No fue posible generar el reporte desde el backend.'
        })
    }
}

// Pide el archivo CSV o PDF al backend y lo entrega al navegador como descarga
export const exportarReporte = async (req, res) => {
    try {
        const formato = req.params.formato === 'pdf' ? 'pdf' : 'csv'
        const filtros = { ...leerFiltros(req.query), formato }
        const respuesta = await apiDescargar(req, `/reporte/exportar${consultaFiltros(filtros)}`)

        if (respuesta.status === 401) return res.redirect('/logout')
        if (!respuesta.ok) throw new Error('Error exportando el reporte')

        res.setHeader('Content-Type', respuesta.headers.get('content-type'))
        res.setHeader('Content-Disposition', respuesta.headers.get('content-disposition') || 'attachment')
        res.send(Buffer.from(await respuesta.arrayBuffer()))
    } catch {
        res.status(500).render('error', {
            usuario: req.session?.usuario,
            titulo: 'Exportación no disponible',
            mensaje: 'No fue posible generar el archivo del reporte. Intente de nuevo.'
        })
    }
}
