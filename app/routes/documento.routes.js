import { Router } from 'express'
import {
    listarDocumentos,
    verFormularioCrear,
    crearDocumento,
    verFormularioEditar,
    editarDocumento,
    verArchivo,
    eliminarDocumento
} from '../controllers/documento.controllers.js'
import { requiereSesion, requiereRol } from '../middlewares/sesion.js'
import { recibirPdf } from '../middlewares/archivo.js'

const router = Router()

// Todas las rutas de documentos exigen sesión iniciada
router.use('/documentos', requiereSesion)

router.get('/documentos', listarDocumentos)

// Crear y editar: Administrador o Funcionario (el formulario puede traer un PDF)
router.get('/documentos/nuevo',        requiereRol('Administrador', 'Funcionario'), verFormularioCrear)
router.post('/documentos/nuevo',       requiereRol('Administrador', 'Funcionario'), recibirPdf, crearDocumento)
router.get('/documentos/editar/:id',   requiereRol('Administrador', 'Funcionario'), verFormularioEditar)
router.post('/documentos/editar/:id',  requiereRol('Administrador', 'Funcionario'), recibirPdf, editarDocumento)

// Ver el PDF del documento: Administrador o Funcionario
router.get('/documentos/:id/archivo',  requiereRol('Administrador', 'Funcionario'), verArchivo)

// Eliminar: solo Administrador
router.post('/documentos/eliminar/:id', requiereRol('Administrador'), eliminarDocumento)

export default router
