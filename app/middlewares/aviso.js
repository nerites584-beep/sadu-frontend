// Mensajes de una sola vez (flash) guardados en la sesión.
// Una acción deja el aviso con guardarAviso() y redirige;
// la siguiente página lo muestra en la cabecera y se borra.

export const guardarAviso = (req, tipo, texto) => {
    req.session.aviso = { tipo, texto }
}

export const mostrarAviso = (req, res, next) => {
    res.locals.aviso = req.session?.aviso || null
    if (req.session?.aviso) delete req.session.aviso
    next()
}
