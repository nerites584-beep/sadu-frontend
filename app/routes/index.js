import { Router } from 'express'
import authRoutes from './auth.routes.js'
import dashboardRoutes from './dashboard.routes.js'
import documentoRoutes from './documento.routes.js'
import usuarioRoutes from './usuario.routes.js'
import reporteRoutes from './reporte.routes.js'
import administracionRoutes from './administracion.routes.js'

const router = Router()

router.get('/', (req, res) => res.redirect('/dashboard'))

// Verificación de estado para el hosting
router.get('/salud', (req, res) => res.json({ estado: 'ok', servicio: 'sadu-frontend' }))

router.use(authRoutes)
router.use(dashboardRoutes)
router.use(documentoRoutes)
router.use(usuarioRoutes)
router.use(reporteRoutes)
router.use(administracionRoutes)

export default router
