import { Router } from 'express'
import {
    listarUsuarios,
    verFormularioCrear,
    crearUsuario,
    verFormularioEditar,
    editarUsuario,
    eliminarUsuario
} from '../controllers/usuario.controllers.js'

const router = Router()

router.get('/usuarios',              listarUsuarios)
router.get('/usuarios/nuevo',        verFormularioCrear)
router.post('/usuarios/nuevo',       crearUsuario)
router.get('/usuarios/editar/:id',   verFormularioEditar)
router.post('/usuarios/editar/:id',  editarUsuario)
router.post('/usuarios/eliminar/:id', eliminarUsuario)

export default router
