import { apiFetch } from '../utils/api.js'
import { guardarAviso } from '../middlewares/aviso.js'

const CLASES = ['dependencia', 'tipo']

export const verCatalogos = async (req, res) => {
    try {
        const { ok, status, datos } = await apiFetch(req, '/catalogo')

        if (status === 401) return res.redirect('/logout')
        if (!ok) throw new Error('Error consultando catálogos')

        res.render('catalogos/index', {
            usuario: req.session.usuario,
            dependencias: datos.dependencias,
            tipos: datos.tipos
        })
    } catch {
        res.status(500).render('error', {
            usuario: req.session?.usuario,
            titulo: 'Error de conexión',
            mensaje: 'No fue posible obtener los catálogos del backend.'
        })
    }
}

export const agregarCatalogo = async (req, res) => {
    const { clase } = req.params
    if (!CLASES.includes(clase)) return res.redirect('/catalogos')

    try {
        const { ok, datos } = await apiFetch(req, `/catalogo/${clase}`, {
            method: 'POST',
            body: JSON.stringify({ nombre: req.body.nombre })
        })
        guardarAviso(req, ok ? 'exito' : 'error', datos?.mensaje || 'No fue posible guardar el valor')
        res.redirect('/catalogos')
    } catch {
        res.status(500).send('Error de conexión al guardar en el catálogo')
    }
}

export const cambiarEstadoCatalogo = async (req, res) => {
    const { clase, id } = req.params
    if (!CLASES.includes(clase)) return res.redirect('/catalogos')

    try {
        const { ok, datos } = await apiFetch(req, `/catalogo/${clase}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ activo: req.body.activo === 'true' })
        })
        guardarAviso(req, ok ? 'exito' : 'error', datos?.mensaje || 'No fue posible actualizar el catálogo')
        res.redirect('/catalogos')
    } catch {
        res.status(500).send('Error de conexión al actualizar el catálogo')
    }
}
