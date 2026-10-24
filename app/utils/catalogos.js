// Catálogos de la Alcaldía usados en formularios, filtros y reportes.
// Se publican en app.locals para que todas las vistas los compartan.

export const TIPOS_DOCUMENTO = [
    'Acuerdo Municipal', 'Decreto', 'Resolución', 'Acta de Comité',
    'Contrato de Prestación de Servicios', 'PQRSDF', 'Oficio de Respuesta',
    'Memorando Interno', 'Circular', 'Informe', 'Certificación', 'Constancia'
]

export const DEPENDENCIAS = [
    'Despacho del Alcalde', 'Secretaría General', 'Secretaría de Hacienda',
    'Secretaría de Planeación', 'Secretaría de Infraestructura', 'Secretaría de Salud',
    'Secretaría de Educación', 'Secretaría de Gobierno', 'Concejo Municipal',
    'Personería Municipal', 'Control Interno', 'Oficina Jurídica', 'Tesorería'
]

export const ESTADOS = ['Activo', 'En trámite', 'Archivado', 'Anulado']

// Colores de cada estado: los mismos de las insignias de la tabla
export const COLORES_ESTADO = {
    'Activo':     '#1e7e34',
    'En trámite': '#d98a0b',
    'Archivado':  '#8a94a1',
    'Anulado':    '#b02a37'
}

export default { TIPOS_DOCUMENTO, DEPENDENCIAS, ESTADOS, COLORES_ESTADO }
