import { Router } from 'express'
import {
    listarUsuarios,
    verFormularioCrear,
    crearUsuario,
    verFormularioEditar,
    editarUsuario,
    eliminarUsuario
} from '../controllers/usuario.controllers.js'
import { requiereSesion, requiereRol } from '../middlewares/sesion.js'

const router = Router()

// La gestión de usuarios es exclusiva del Administrador
router.use('/usuarios', requiereSesion, requiereRol('Administrador'))

router.get('/usuarios',              listarUsuarios)
router.get('/usuarios/nuevo',        verFormularioCrear)
router.post('/usuarios/nuevo',       crearUsuario)
router.get('/usuarios/editar/:id',   verFormularioEditar)
router.post('/usuarios/editar/:id',  editarUsuario)
router.post('/usuarios/eliminar/:id', eliminarUsuario)

export default router
