import { apiFetch, apiSubirArchivo, apiDescargar, soloFecha, leerFiltros, consultaFiltros } from '../utils/api.js'
import { guardarAviso } from '../middlewares/aviso.js'

export const listarDocumentos = async (req, res) => {
    try {
        const filtros = leerFiltros(req.query)
        const { ok, status, datos: documentos } = await apiFetch(req, `/documento${consultaFiltros(filtros)}`)

        if (status === 401) return res.redirect('/logout')
        if (!ok) throw new Error('Error consultando documentos')

        documentos.forEach(doc => { doc.fecha_registro = soloFecha(doc.fecha_registro) })

        res.render('documentos/index', {
            usuario: req.session.usuario,
            documentos,
            filtros,
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

const renderFormulario = (req, res, { documento, accion, errores, estado = 200 }) =>
    res.status(estado).render('documentos/formulario', {
        usuario: req.session.usuario,
        documento,
        accion,
        errores
    })

export const verFormularioCrear = (req, res) => {
    renderFormulario(req, res, { documento: null, accion: 'Registrar', errores: null })
}

export const crearDocumento = async (req, res) => {
    try {
        if (req.errorArchivo) {
            return renderFormulario(req, res, { documento: req.body, accion: 'Registrar', errores: [req.errorArchivo], estado: 400 })
        }

        const { ok, datos } = await apiFetch(req, '/documento', {
            method: 'POST',
            body: JSON.stringify({ ...req.body, usuario_id: req.session.usuario.id })
        })

        if (!ok) {
            return renderFormulario(req, res, {
                documento: req.body,
                accion: 'Registrar',
                errores: datos?.errores || [datos?.mensaje || 'Error al crear el documento'],
                estado: 400
            })
        }

        // El documento ya existe: si se adjuntó un PDF se carga ahora.
        // Si la carga falla se abre la edición para que el usuario lo intente de nuevo.
        if (req.file) {
            const subida = await apiSubirArchivo(req, `/documento/${datos.id}/archivo`, req.file)
            if (!subida.ok) {
                return res.redirect(`/documentos/editar/${datos.id}?pdf=error`)
            }
        }
        guardarAviso(req, 'exito', datos?.mensaje || 'Documento radicado correctamente')
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

        const errores = req.query.pdf === 'error'
            ? ['El documento se registró, pero el PDF no se pudo cargar. Selecciónelo de nuevo y pulse Actualizar.']
            : null

        renderFormulario(req, res, { documento, accion: 'Actualizar', errores })
    } catch {
        res.status(500).send('Error de conexión al consultar documento')
    }
}

export const editarDocumento = async (req, res) => {
    const id = req.params.id
    // El formulario no reenvía estos datos, se conservan para volver a mostrarlos si hay errores
    const documento = { ...req.body, id, archivo: req.body.archivo_actual, archivo_nombre: req.body.archivo_nombre_actual }

    try {
        if (req.errorArchivo) {
            return renderFormulario(req, res, { documento, accion: 'Actualizar', errores: [req.errorArchivo], estado: 400 })
        }

        const { ok, datos } = await apiFetch(req, `/documento/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(req.body)
        })

        if (!ok) {
            return renderFormulario(req, res, {
                documento,
                accion: 'Actualizar',
                errores: datos?.errores || [datos?.mensaje || 'Error al actualizar el documento'],
                estado: 400
            })
        }

        if (req.file) {
            const subida = await apiSubirArchivo(req, `/documento/${id}/archivo`, req.file)
            if (!subida.ok) {
                return renderFormulario(req, res, {
                    documento,
                    accion: 'Actualizar',
                    errores: subida.datos?.errores || ['No fue posible cargar el archivo PDF'],
                    estado: 400
                })
            }
        }
        guardarAviso(req, 'exito', 'Documento actualizado correctamente')
        res.redirect('/documentos')
    } catch {
        res.status(500).send('Error de conexión al actualizar documento')
    }
}

export const verArchivo = async (req, res) => {
    try {
        const respuesta = await apiDescargar(req, `/documento/${req.params.id}/archivo`)

        if (respuesta.status === 401) return res.redirect('/logout')
        if (!respuesta.ok) {
            return res.status(respuesta.status).render('error', {
                usuario: req.session.usuario,
                titulo: 'Archivo no disponible',
                mensaje: 'Este documento no tiene un archivo PDF cargado.'
            })
        }

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', respuesta.headers.get('content-disposition') || 'inline')
        res.send(Buffer.from(await respuesta.arrayBuffer()))
    } catch {
        res.status(500).send('Error de conexión al consultar el archivo')
    }
}

export const eliminarDocumento = async (req, res) => {
    try {
        const { ok, datos } = await apiFetch(req, `/documento/${req.params.id}`, { method: 'DELETE' })
        guardarAviso(req, ok ? 'exito' : 'error', datos?.mensaje || (ok ? 'Documento eliminado' : 'No fue posible eliminar el documento'))
        res.redirect('/documentos')
    } catch {
        res.status(500).send('Error de conexión al eliminar documento')
    }
}
