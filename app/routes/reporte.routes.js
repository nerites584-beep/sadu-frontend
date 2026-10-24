import { Router } from 'express'
import { verReportes, exportarReporte } from '../controllers/reporte.controllers.js'
import { requiereSesion, requiereRol } from '../middlewares/sesion.js'

const router = Router()

// Reportes y exportación: Administrador o Funcionario
router.use('/reportes', requiereSesion, requiereRol('Administrador', 'Funcionario'))

router.get('/reportes',                    verReportes)
router.get('/reportes/exportar/:formato',  exportarReporte)

export default router
