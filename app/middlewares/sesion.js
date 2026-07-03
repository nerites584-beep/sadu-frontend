// Middlewares de protección de rutas del frontend
// - requiereSesion: si no hay sesión iniciada redirige al login
// - requiereRol: además exige un rol específico

export const requiereSesion = (req, res, next) => {
    if (!req.session?.token) {
        return res.redirect('/login')
    }
    next()
}

export const requiereRol = (...rolesPermitidos) => (req, res, next) => {
    if (!rolesPermitidos.includes(req.session?.usuario?.rol)) {
        return res.status(403).render('error', {
            usuario: req.session?.usuario,
            titulo: 'Acceso denegado',
            mensaje: 'No tiene permisos para acceder a esta sección.'
        })
    }
    next()
}
