# API RESTful de Tickets y Notificaciones

<a href="https://trendshift.io/repositories/28176?utm_source=repository-badge&amp;utm_medium=badge&amp;utm_campaign=badge-repository-28176" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/repositories/28176" alt="debpalash%2FVoiceStudio | Trendshift" width="250" height="55"/></a>

API desarrollada con Node.js y Express para administrar tickets, registrar notificaciones y enviar alertas reales por correo mediante Nodemailer.

## Funcionalidades

- Crear, listar, asignar, actualizar y eliminar tickets.
- Paginar el listado de tickets con `page` y `limit`.
- Registrar notificaciones relacionadas con cada ticket.
- Consultar el historial de notificaciones de un ticket.
- Enviar correos reales cuando se crea o asigna un ticket.
- Registrar el resultado del correo como `pending`, `sent` o `failed`.
- Responder errores de forma uniforme mediante un middleware global.

## Requisitos

- Node.js 18 o superior.
- npm.
- Una cuenta de correo compatible con SMTP.
- Para Gmail, verificacion en dos pasos y una contrasena de aplicacion.

## Instalacion

```bash
git clone https://github.com/C5-PHO/DAWA-S5.git
cd DAWA-S5
npm install
```

## Variables de entorno

Copia `.env.example` como `.env` y completa los valores:

```env
MAILER_SERVICE=gmail
MAILER_EMAIL=correo_emisor@gmail.com
MAILER_SECRET_KEY=contrasena_de_aplicacion
MAILER_TO=correo_receptor@gmail.com
```

El archivo `.env` esta excluido de Git. Nunca publiques contrasenas ni credenciales reales.

Si `MAILER_TO` queda vacio, el sistema usa `MAILER_EMAIL` como destinatario.

## Ejecucion

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

La API queda disponible en:

```text
http://localhost:3000
```

Nodemon esta configurado para ignorar `database/db.json`. Esto evita que el servidor se reinicie mientras se guarda una notificacion o se envia un correo.

## Endpoints

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| `POST` | `/tickets` | Crear un ticket |
| `GET` | `/tickets?page=1&limit=5` | Listar tickets con paginacion |
| `PUT` | `/tickets/:id/assign` | Asignar un usuario |
| `PUT` | `/tickets/:id/status` | Cambiar el estado |
| `DELETE` | `/tickets/:id` | Eliminar un ticket |
| `GET` | `/tickets/:id/notifications` | Consultar notificaciones del ticket |
| `GET` | `/notifications` | Listar todas las notificaciones |

## Ejemplos

### Crear un ticket

```http
POST /tickets
Content-Type: application/json
```

```json
{
  "title": "Problema de acceso",
  "description": "El usuario no puede ingresar al sistema",
  "priority": "high"
}
```

### Asignar un ticket

```http
PUT /tickets/:id/assign
Content-Type: application/json
```

```json
{
  "user": "Piero Huaytalla"
}
```

### Cambiar el estado

```http
PUT /tickets/:id/status
Content-Type: application/json
```

```json
{
  "status": "asignado"
}
```

### Respuesta paginada

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 0,
    "totalPages": 0
  }
}
```

## Manejo de errores

Los errores se envian con una estructura comun:

```json
{
  "error": "Ticket no encontrado"
}
```

Codigos utilizados:

- `400`: datos o parametros invalidos.
- `404`: ticket o ruta no encontrada.
- `500`: error interno del servidor.

## Estructura

```text
controllers/     Controladores HTTP
database/        Base de datos JSON local
errors/          Errores personalizados
middlewares/     Middleware global de errores
repositories/    Acceso y persistencia de datos
routes/          Definicion de endpoints
services/        Logica de negocio y correo
docs/evidencias/ Capturas de las pruebas
app.js           Configuracion de Express
```

## Evidencias

- [Creacion de un ticket](docs/evidencias/01-crear-ticket.png)
- [Paginacion de tickets](docs/evidencias/02-paginacion-tickets.png)
- [Notificaciones por ticket](docs/evidencias/03-notificaciones-por-ticket.png)
- [Manejo global de errores](docs/evidencias/04-manejo-error.png)

La evidencia de notificaciones muestra un correo con estado `sent`, confirmado mediante una entrega real al destinatario configurado.

## Solucion de problemas de correo

- `EAUTH` o codigo SMTP `535`: revisa el correo y la contrasena de aplicacion.
- `ETIMEDOUT`: la red probablemente bloquea el puerto SMTP.
- `ENETUNREACH`: la red no tiene una ruta disponible hacia la direccion resuelta.
- Si el correo no aparece, revisa spam y consulta `GET /notifications` para comprobar su estado.

Algunas redes institucionales bloquean SMTP. En ese caso, prueba otra red autorizada, como una conexion domestica o un hotspot personal.
