import { Router } from 'express'
import { verLogin, procesarLogin, cerrarSesion } from '../controllers/auth.controllers.js'

const router = Router()

router.get('/login',  verLogin)
router.post('/login', procesarLogin)
router.get('/logout', cerrarSesion)

export default router
