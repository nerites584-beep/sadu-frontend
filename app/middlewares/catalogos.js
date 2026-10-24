// Carga los tipos de documento y las dependencias desde el backend
// para los formularios y filtros. Si el backend no responde, se usan
// los valores iniciales de utils/catalogos.js para no bloquear la pantalla.

import { apiFetch } from '../utils/api.js'
import catalogosBase from '../utils/catalogos.js'

export const cargarCatalogos = async (req, res, next) => {
    try {
        const { ok, datos } = await apiFetch(req, '/catalogo')
        if (!ok) throw new Error('Catálogos no disponibles')

        const nombres = (lista, soloActivos) =>
            lista.filter(item => !soloActivos || item.activo).map(item => item.nombre)

        res.locals.catalogos = {
            ...catalogosBase,
            TIPOS_DOCUMENTO:    nombres(datos.tipos, true),
            DEPENDENCIAS:       nombres(datos.dependencias, true),
            TODOS_TIPOS:        nombres(datos.tipos, false),
            TODAS_DEPENDENCIAS: nombres(datos.dependencias, false)
        }
    } catch {
        res.locals.catalogos = {
            ...catalogosBase,
            TODOS_TIPOS:        catalogosBase.TIPOS_DOCUMENTO,
            TODAS_DEPENDENCIAS: catalogosBase.DEPENDENCIAS
        }
    }
    next()
}
