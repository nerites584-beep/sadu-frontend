import { Router } from 'express'
import { verCatalogos, agregarCatalogo, cambiarEstadoCatalogo } from '../controllers/catalogo.controllers.js'
import { verAuditoria } from '../controllers/auditoria.controllers.js'
import { requiereSesion, requiereRol } from '../middlewares/sesion.js'

const router = Router()

// Catálogos y auditoría: exclusivos del Administrador
router.use(['/catalogos', '/auditoria'], requiereSesion, requiereRol('Administrador'))

router.get('/catalogos',                      verCatalogos)
router.post('/catalogos/:clase',              agregarCatalogo)
router.post('/catalogos/:clase/:id/estado',   cambiarEstadoCatalogo)

router.get('/auditoria', verAuditoria)

export default router
