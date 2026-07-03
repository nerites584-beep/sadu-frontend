import { Router } from 'express'
import { verDashboard } from '../controllers/dashboard.controllers.js'
import { requiereSesion } from '../middlewares/sesion.js'

const router = Router()

router.get('/dashboard', requiereSesion, verDashboard)

export default router
