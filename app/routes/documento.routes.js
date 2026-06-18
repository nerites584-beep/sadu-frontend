import { Router } from 'express'
import {
    listarDocumentos,
    verFormularioCrear,
    crearDocumento,
    verFormularioEditar,
    editarDocumento,
    eliminarDocumento
} from '../controllers/documento.controllers.js'

const router = Router()

router.get('/documentos',              listarDocumentos)
router.get('/documentos/nuevo',        verFormularioCrear)
router.post('/documentos/nuevo',       crearDocumento)
router.get('/documentos/editar/:id',   verFormularioEditar)
router.post('/documentos/editar/:id',  editarDocumento)
router.post('/documentos/eliminar/:id', eliminarDocumento)

export default router
