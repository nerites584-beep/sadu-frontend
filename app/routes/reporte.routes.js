import { Router } from 'express'
import { verReportes, exportarReporte } from '../controllers/reporte.controllers.js'
import { requiereSesion, requiereRol } from '../middlewares/sesion.js'
import { cargarCatalogos } from '../middlewares/catalogos.js'

const router = Router()

// Reportes y exportación: Administrador o Funcionario
router.use('/reportes', requiereSesion, requiereRol('Administrador', 'Funcionario'), cargarCatalogos)

router.get('/reportes',                    verReportes)
router.get('/reportes/exportar/:formato',  exportarReporte)

export default router
