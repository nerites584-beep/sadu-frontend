// Verificación de variables de entorno al iniciar el frontend
// Si falta una variable obligatoria el servidor no arranca y dice cuál falta.
// SESSION_SECRET no detiene el arranque (para no tumbar un despliegue que ya funciona),
// pero se avisa en la consola porque con la clave por defecto se podría falsificar una sesión.

export const VARIABLES_OBLIGATORIAS = ['PORT', 'BACKEND_URL']

export const variablesFaltantes = (env = process.env, obligatorias = VARIABLES_OBLIGATORIAS) =>
    obligatorias.filter((nombre) => !env[nombre] || String(env[nombre]).trim() === '')

export const verificarEntorno = (env = process.env) => {
    const faltantes = variablesFaltantes(env)
    if (faltantes.length > 0) {
        throw new Error(`Faltan variables de entorno obligatorias: ${faltantes.join(', ')}`)
    }
    const avisos = []
    if (!env.SESSION_SECRET) {
        avisos.push('SESSION_SECRET no está definida: se usa la clave por defecto. Defina una clave propia.')
    }
    avisos.forEach((aviso) => console.warn(`[SADU frontend] ${aviso}`))
    return avisos
}
