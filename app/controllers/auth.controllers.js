import { apiFetch } from '../utils/api.js'

export const verLogin = (req, res) => {
    if (req.session?.token) {
        return res.redirect('/dashboard')
    }
    res.render('auth/login', { error: null })
}

export const procesarLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const { ok, datos } = await apiFetch(req, '/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        })

        if (!ok) {
            const mensaje = datos?.mensaje || 'No fue posible iniciar sesión'
            return res.status(401).render('auth/login', { error: mensaje })
        }

        // La sesión guarda el token JWT y los datos básicos del usuario
        req.session.token = datos.token
        req.session.usuario = datos.usuario
        res.redirect('/dashboard')
    } catch {
        res.status(500).render('auth/login', {
            error: 'No hay conexión con el servidor. Verifique que el backend esté en ejecución.'
        })
    }
}

export const cerrarSesion = (req, res) => {
    req.session.destroy(() => res.redirect('/login'))
}
