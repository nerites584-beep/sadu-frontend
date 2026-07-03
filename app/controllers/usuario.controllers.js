import { apiFetch } from '../utils/api.js'

export const listarUsuarios = async (req, res) => {
    try {
        const { ok, status, datos: usuarios } = await apiFetch(req, '/usuario')

        if (status === 401) return res.redirect('/logout')
        if (!ok) throw new Error('Error consultando usuarios')

        res.render('usuarios/index', {
            usuario: req.session.usuario,
            usuarios
        })
    } catch {
        res.status(500).render('error', {
            usuario: req.session?.usuario,
            titulo: 'Error de conexión',
            mensaje: 'No fue posible obtener los usuarios del backend.'
        })
    }
}

export const verFormularioCrear = (req, res) => {
    res.render('usuarios/formulario', {
        usuario: req.session.usuario,
        usuarioEditado: null,
        accion: 'Registrar',
        errores: null
    })
}

export const crearUsuario = async (req, res) => {
    try {
        const { ok, datos } = await apiFetch(req, '/usuario', {
            method: 'POST',
            body: JSON.stringify(req.body)
        })

        if (!ok) {
            return res.status(400).render('usuarios/formulario', {
                usuario: req.session.usuario,
                usuarioEditado: req.body,
                accion: 'Registrar',
                errores: datos?.errores || [datos?.mensaje || 'Error al crear el usuario']
            })
        }
        res.redirect('/usuarios')
    } catch {
        res.status(500).send('Error de conexión al crear usuario')
    }
}

export const verFormularioEditar = async (req, res) => {
    try {
        const { ok, datos: usuarioEditado } = await apiFetch(req, `/usuario/${req.params.id}`)
        if (!ok) return res.redirect('/usuarios')

        res.render('usuarios/formulario', {
            usuario: req.session.usuario,
            usuarioEditado,
            accion: 'Actualizar',
            errores: null
        })
    } catch {
        res.status(500).send('Error de conexión al consultar usuario')
    }
}

export const editarUsuario = async (req, res) => {
    try {
        const { ok, datos } = await apiFetch(req, `/usuario/${req.params.id}`, {
            method: 'PATCH',
            body: JSON.stringify(req.body)
        })

        if (!ok) {
            return res.status(400).render('usuarios/formulario', {
                usuario: req.session.usuario,
                usuarioEditado: { ...req.body, id: req.params.id },
                accion: 'Actualizar',
                errores: datos?.errores || [datos?.mensaje || 'Error al actualizar el usuario']
            })
        }
        res.redirect('/usuarios')
    } catch {
        res.status(500).send('Error de conexión al actualizar usuario')
    }
}

export const eliminarUsuario = async (req, res) => {
    try {
        await apiFetch(req, `/usuario/${req.params.id}`, { method: 'DELETE' })
        res.redirect('/usuarios')
    } catch {
        res.status(500).send('Error de conexión al eliminar usuario')
    }
}
