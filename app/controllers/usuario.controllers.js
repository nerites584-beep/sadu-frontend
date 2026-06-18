import fetch from 'node-fetch'
import config from '../config/environments/index.js'

const API = `${config.backendUrl}/usuario`

export const listarUsuarios = async (req, res) => {
    try {
        const response = await fetch(API)
        const [usuarios] = await response.json()
        res.render('usuarios/index', { usuarios })
    } catch (error) {
        res.status(500).send('Error al obtener usuarios')
    }
}

export const verFormularioCrear = (req, res) => {
    res.render('usuarios/formulario', { usuario: null, accion: 'Registrar' })
}

export const crearUsuario = async (req, res) => {
    try {
        await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        })
        res.redirect('/usuarios')
    } catch (error) {
        res.status(500).send('Error al crear usuario')
    }
}

export const verFormularioEditar = async (req, res) => {
    try {
        const response = await fetch(`${API}/${req.params.id}`)
        const [rows] = await response.json()
        res.render('usuarios/formulario', { usuario: rows[0], accion: 'Actualizar' })
    } catch (error) {
        res.status(500).send('Error al obtener usuario')
    }
}

export const editarUsuario = async (req, res) => {
    try {
        await fetch(`${API}/${req.params.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        })
        res.redirect('/usuarios')
    } catch (error) {
        res.status(500).send('Error al actualizar usuario')
    }
}

export const eliminarUsuario = async (req, res) => {
    try {
        await fetch(`${API}/${req.params.id}`, { method: 'DELETE' })
        res.redirect('/usuarios')
    } catch (error) {
        res.status(500).send('Error al eliminar usuario')
    }
}
