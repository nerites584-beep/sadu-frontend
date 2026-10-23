// Cliente HTTP hacia el backend SADU
// Centraliza las peticiones fetch agregando el token JWT guardado en la sesión.

import fetch from 'node-fetch'
import config from '../config/environments/index.js'

export const apiFetch = async (req, ruta, opciones = {}) => {
    const token = req.session?.token

    const respuesta = await fetch(`${config.backendUrl}${ruta}`, {
        ...opciones,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(opciones.headers || {})
        }
    })

    let datos = null
    try { datos = await respuesta.json() } catch { /* respuesta sin cuerpo */ }

    return { ok: respuesta.ok, status: respuesta.status, datos }
}

// Las fechas llegan del backend en formato ISO (2026-01-15T05:00:00.000Z);
// para las vistas y los <input type="date"> solo se necesita AAAA-MM-DD.
export const soloFecha = (valor) => String(valor ?? '').slice(0, 10)

// Envía un PDF al backend como multipart/form-data.
// Se usa el fetch y FormData nativos de Node porque node-fetch no arma multipart.
export const apiSubirArchivo = async (req, ruta, archivo) => {
    const formulario = new FormData()
    formulario.append('archivo', new Blob([archivo.buffer], { type: archivo.mimetype }), archivo.originalname)

    const respuesta = await globalThis.fetch(`${config.backendUrl}${ruta}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${req.session?.token}` },
        body: formulario
    })

    let datos = null
    try { datos = await respuesta.json() } catch { /* respuesta sin cuerpo */ }

    return { ok: respuesta.ok, status: respuesta.status, datos }
}

// Pide un archivo al backend y lo devuelve tal cual al navegador
export const apiDescargar = async (req, ruta) =>
    globalThis.fetch(`${config.backendUrl}${ruta}`, {
        headers: { Authorization: `Bearer ${req.session?.token}` }
    })
