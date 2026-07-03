import { apiFetch, soloFecha } from '../utils/api.js'

export const listarDocumentos = async (req, res) => {
    try {
        const { ok, status, datos: documentos } = await apiFetch(req, '/documento')

        if (status === 401) return res.redirect('/logout')
        if (!ok) throw new Error('Error consultando documentos')

        documentos.forEach(doc => { doc.fecha_registro = soloFecha(doc.fecha_registro) })

        res.render('documentos/index', {
            usuario: req.session.usuario,
            documentos,
            error: null
        })
    } catch {
        res.status(500).render('error', {
            usuario: req.session?.usuario,
            titulo: 'Error de conexión',
            mensaje: 'No fue posible obtener los documentos del backend.'
        })
    }
}

export const verFormularioCrear = (req, res) => {
    res.render('documentos/formulario', {
        usuario: req.session.usuario,
        documento: null,
        accion: 'Registrar',
        errores: null
    })
}

export const crearDocumento = async (req, res) => {
    try {
        const { ok, datos } = await apiFetch(req, '/documento', {
            method: 'POST',
            body: JSON.stringify({ ...req.body, usuario_id: req.session.usuario.id })
        })

        if (!ok) {
            return res.status(400).render('documentos/formulario', {
                usuario: req.session.usuario,
                documento: req.body,
                accion: 'Registrar',
                errores: datos?.errores || [datos?.mensaje || 'Error al crear el documento']
            })
        }
        res.redirect('/documentos')
    } catch {
        res.status(500).send('Error de conexión al crear documento')
    }
}

export const verFormularioEditar = async (req, res) => {
    try {
        const { ok, datos: documento } = await apiFetch(req, `/documento/${req.params.id}`)
        if (!ok) return res.redirect('/documentos')

        documento.fecha_registro = soloFecha(documento.fecha_registro)

        res.render('documentos/formulario', {
            usuario: req.session.usuario,
            documento,
            accion: 'Actualizar',
            errores: null
        })
    } catch {
        res.status(500).send('Error de conexión al consultar documento')
    }
}

export const editarDocumento = async (req, res) => {
    try {
        const { ok, datos } = await apiFetch(req, `/documento/${req.params.id}`, {
            method: 'PATCH',
            body: JSON.stringify(req.body)
        })

        if (!ok) {
            return res.status(400).render('documentos/formulario', {
                usuario: req.session.usuario,
                documento: { ...req.body, id: req.params.id },
                accion: 'Actualizar',
                errores: datos?.errores || [datos?.mensaje || 'Error al actualizar el documento']
            })
        }
        res.redirect('/documentos')
    } catch {
        res.status(500).send('Error de conexión al actualizar documento')
    }
}

export const eliminarDocumento = async (req, res) => {
    try {
        await apiFetch(req, `/documento/${req.params.id}`, { method: 'DELETE' })
        res.redirect('/documentos')
    } catch {
        res.status(500).send('Error de conexión al eliminar documento')
    }
}
