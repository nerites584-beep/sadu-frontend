// Recibe el PDF opcional del formulario de documentos.
// El archivo queda en memoria (req.file) y luego se reenvía al backend, que es quien lo guarda.
// Si el archivo no es PDF o es muy grande, se deja el error en req.errorArchivo
// para mostrarlo en el mismo formulario.

import multer from 'multer'

const TAMANO_MAXIMO = 10 * 1024 * 1024

const cargador = multer({
    storage: multer.memoryStorage(),
    defParamCharset: 'utf8',
    limits: { fileSize: TAMANO_MAXIMO, files: 1 },
    fileFilter: (req, file, cb) => {
        const esPdf = file.mimetype === 'application/pdf' && /\.pdf$/i.test(file.originalname)
        cb(esPdf ? null : new Error('SOLO_PDF'), esPdf)
    }
}).single('archivo')

export const recibirPdf = (req, res, next) => {
    cargador(req, res, (error) => {
        if (error) {
            req.errorArchivo = error.code === 'LIMIT_FILE_SIZE'
                ? 'El archivo supera el tamaño máximo de 10 MB'
                : 'Solo se permiten archivos PDF'
        }
        next()
    })
}
