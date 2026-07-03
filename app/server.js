import express from 'express'
import session from 'express-session'
import path from 'path'
import { fileURLToPath } from 'url'
import config from './config/environments/index.js'
import routes from './routes/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = express()

server.set('view engine', 'ejs')
server.set('views', path.join(__dirname, 'views'))

server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(express.static(path.join(__dirname, '../public')))

// Sesión del lado del servidor: guarda el token JWT y los datos del usuario
server.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,          // la cookie no es accesible desde JavaScript del navegador
        maxAge: 8 * 60 * 60 * 1000  // 8 horas, igual que la expiración del token
    }
}))

server.use(routes)

server.listen(config.port, () => {
    console.log(`Servidor SADU frontend corriendo en el puerto ${config.port}`)
})

export default server
