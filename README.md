# SADU Frontend — Sistema Administrativo Documental Unificado

Interfaz web de SADU, el sistema de gestión documental para la Alcaldía Municipal de San Antonio del Tequendama.
Proyecto formativo del programa Análisis y Desarrollo de Software (SENA, ficha 3186583).

- **Tecnologías:** Node.js, Express 5, EJS, express-session, Multer.
- **API que consume:** [sadu-backend](https://github.com/nerites584-beep/sadu-backend)

## 1. Requisitos

- Node.js 20 o superior
- El backend de SADU corriendo (por defecto en `http://localhost:3030`)

## 2. Instalación

```bash
git clone https://github.com/nerites584-beep/sadu-frontend.git
cd sadu-frontend
npm install
```

1. Copie `app/config/environments/developer.env.example` como `developer.env` y complete los valores
   (`PORT`, `BACKEND_URL` y `SESSION_SECRET`).
2. Inicie el servidor:

```bash
npm run dev     # desarrollo
npm start       # ejecución normal
```

3. Abra `http://localhost:4000` en el navegador.

Si falta `PORT` o `BACKEND_URL` el servidor no arranca y dice cuál falta. Si no se define `SESSION_SECRET`
muestra un aviso, porque la clave por defecto no es segura.

## 3. Estructura del proyecto

```
app/
  config/        variables de entorno
  controllers/   lógica de cada pantalla (dashboard, documentos, usuarios, reportes, administración)
  middlewares/   sesión, avisos, catálogos, archivos y seguridad
  routes/        rutas de las pantallas
  utils/         cliente HTTP hacia el backend y catálogos
  views/         vistas EJS y componentes reutilizables (partials)
public/css/      estilos
test/            pruebas unitarias (node:test)
```

## 4. Roles

| Rol | Puede hacer |
|---|---|
| Administrador | Todo: documentos, usuarios, catálogos, auditoría y reportes |
| Funcionario | Radicar, editar y consultar documentos; cargar PDF; exportar reportes |
| Consulta | Solo consultar documentos y reportes |

## 5. Pruebas

```bash
npm test
```

Se ejecutan también de forma automática en GitHub Actions con cada `push`.

## 6. Proceso de calidad del equipo

Se sigue el mismo proceso del backend (ver el README de `sadu-backend`):

- Ramas `feature/<nombre>` y `fix/<nombre>`; `main` siempre funciona.
- Commits con el formato `tipo(módulo): descripción` (`feat`, `fix`, `test`, `docs`, `chore`, `merge`).
- Antes de integrar a `main` se revisa la lista de chequeo de `.github/pull_request_template.md`.

**Seguridad en el frontend.**
- El token JWT se guarda en la sesión del servidor, nunca en el navegador.
- Cookie de sesión `httpOnly` y `sameSite=lax`, con vencimiento de 8 horas.
- Cabeceras HTTP de seguridad y sin la cabecera `X-Powered-By`.
- Páginas de error amables (404 y 500) que no muestran detalles técnicos.
