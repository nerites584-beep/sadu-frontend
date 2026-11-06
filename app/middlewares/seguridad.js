// Middlewares generales de seguridad y control de errores del frontend
// - cabecerasSeguridad: cabeceras HTTP que protegen las páginas de SADU
// - paginaNoEncontrada: muestra la vista de error con código 404
// - manejadorErrores: muestra un mensaje amable si algo falla, sin detalles técnicos

export const CABECERAS_SEGURIDAD = {
    'X-Content-Type-Options': 'nosniff',          // el navegador no adivina el tipo de archivo
    'X-Frame-Options': 'SAMEORIGIN',              // evita que otro sitio cargue SADU dentro de un iframe
    'Referrer-Policy': 'same-origin'              // no envía la URL de SADU a sitios externos
}

export const cabecerasSeguridad = (req, res, next) => {
    for (const [nombre, valor] of Object.entries(CABECERAS_SEGURIDAD)) {
        res.setHeader(nombre, valor)
    }
    next()
}

export const paginaNoEncontrada = (req, res) => {
    res.status(404).render('error', {
        titulo: 'Página no encontrada',
        mensaje: 'La dirección que buscó no existe en SADU.',
        usuario: req.session?.usuario
    })
}

// eslint-disable-next-line no-unused-vars
export const manejadorErrores = (error, req, res, next) => {
    console.error('[SADU frontend]', error?.message ?? error)
    res.status(500).render('error', {
        titulo: 'Ocurrió un error',
        mensaje: 'No fue posible completar la acción. Intente de nuevo o comuníquese con el administrador.',
        usuario: req.session?.usuario
    })
}
