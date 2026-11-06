// Pruebas unitarias del frontend: utilidades de fechas y filtros,
// cabeceras de seguridad, página 404 y verificación del entorno.

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { soloFecha, leerFiltros, consultaFiltros } from '../app/utils/api.js'
import { cabecerasSeguridad, paginaNoEncontrada, CABECERAS_SEGURIDAD } from '../app/middlewares/seguridad.js'
import { variablesFaltantes, verificarEntorno } from '../app/config/environments/verificar.js'

const crearRes = () => {
    const res = { cabeceras: {}, codigo: 200, vista: null, datos: null }
    res.setHeader = (n, v) => { res.cabeceras[n] = v }
    res.status = (c) => { res.codigo = c; return res }
    res.render = (vista, datos) => { res.vista = vista; res.datos = datos; return res }
    return res
}

describe('Utilidades de la API', () => {
    test('soloFecha deja la fecha en formato AAAA-MM-DD', () => {
        assert.equal(soloFecha('2026-01-15T05:00:00.000Z'), '2026-01-15')
        assert.equal(soloFecha(null), '')
    })

    test('leerFiltros conserva solo los campos permitidos y sin espacios', () => {
        const filtros = leerFiltros({ q: '  oficio ', estado: 'Activo', otro: 'x', tipo: '' })
        assert.deepEqual(filtros, { q: 'oficio', estado: 'Activo' })
    })

    test('consultaFiltros arma la consulta de la URL', () => {
        assert.equal(consultaFiltros({ estado: 'Activo' }), '?estado=Activo')
        assert.equal(consultaFiltros({}), '')
    })
})

describe('Seguridad del frontend', () => {
    test('agrega las cabeceras de seguridad', () => {
        const res = crearRes()
        let continuo = false
        cabecerasSeguridad({}, res, () => { continuo = true })
        assert.equal(continuo, true)
        for (const [nombre, valor] of Object.entries(CABECERAS_SEGURIDAD)) {
            assert.equal(res.cabeceras[nombre], valor)
        }
    })

    test('una página inexistente muestra la vista de error con 404', () => {
        const res = crearRes()
        paginaNoEncontrada({ session: {} }, res)
        assert.equal(res.codigo, 404)
        assert.equal(res.vista, 'error')
    })
})

describe('Verificación de variables de entorno', () => {
    test('detecta BACKEND_URL faltante', () => {
        assert.deepEqual(variablesFaltantes({ PORT: '3000' }), ['BACKEND_URL'])
    })

    test('no arranca si falta una variable obligatoria', () => {
        assert.throws(() => verificarEntorno({ PORT: '3000' }), /BACKEND_URL/)
    })

    test('avisa cuando SESSION_SECRET no está definida', () => {
        const avisos = verificarEntorno({ PORT: '3000', BACKEND_URL: 'http://localhost:3030' })
        assert.equal(avisos.length, 1)
    })
})
