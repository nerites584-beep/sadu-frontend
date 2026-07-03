import { Router } from 'express'
import authRoutes from './auth.routes.js'
import dashboardRoutes from './dashboard.routes.js'
import documentoRoutes from './documento.routes.js'
import usuarioRoutes from './usuario.routes.js'

const router = Router()

router.get('/', (req, res) => res.redirect('/dashboard'))

router.use(authRoutes)
router.use(dashboardRoutes)
router.use(documentoRoutes)
router.use(usuarioRoutes)

export default router
