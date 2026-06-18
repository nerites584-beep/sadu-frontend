import fetch from 'node-fetch'
import config from '../config/environments/index.js'

const API = `${config.backendUrl}/documento`

export const listarDocumentos = async (req, res) => {
    try {
        const response = await fetch(API)
        const [documentos] = await response.json()
        res.render('documentos/index', { documentos })
    } catch (error) {
        res.status(500).send('Error al obtener documentos')
    }
}

export const verFormularioCrear = (req, res) => {
    res.render('documentos/formulario', { documento: null, accion: 'Registrar' })
}

export const crearDocumento = async (req, res) => {
    try {
        await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        })
        res.redirect('/documentos')
    } catch (error) {
        res.status(500).send('Error al crear documento')
    }
}

export const verFormularioEditar = async (req, res) => {
    try {
        const response = await fetch(`${API}/${req.params.id}`)
        const [rows] = await response.json()
        res.render('documentos/formulario', { documento: rows[0], accion: 'Actualizar' })
    } catch (error) {
        res.status(500).send('Error al obtener documento')
    }
}

export const editarDocumento = async (req, res) => {
    try {
        await fetch(`${API}/${req.params.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        })
        res.redirect('/documentos')
    } catch (error) {
        res.status(500).send('Error al actualizar documento')
    }
}

export const eliminarDocumento = async (req, res) => {
    try {
        await fetch(`${API}/${req.params.id}`, { method: 'DELETE' })
        res.redirect('/documentos')
    } catch (error) {
        res.status(500).send('Error al eliminar documento')
    }
}
