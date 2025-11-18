# Título del Proyecto
Plataforma de Logística para Repartos Rapidos SAS

## Descripción Corta
En la empresa de Repartos Rapidos SAS, se siguen manejando y administrando toda su estructura de manera manual y por separado, lo que lleva a que se puedan cometer errores por toda la intervención humana que se realiza dentro de estos procesos, además de que el manejo manual de algunas áreas puede llevar a un largo tiempo de ejecución de algunas tareas de la empresa.

## Demo o Capturas de Pantalla
<img width="934" height="274" alt="image" src="https://github.com/user-attachments/assets/dd7a6bfe-4721-4ba9-9944-df3754b2f5b9" />
<img width="936" height="317" alt="image" src="https://github.com/user-attachments/assets/fbb85dc5-7aff-444c-82a3-63fe7034b569" />
<img width="620" height="404" alt="image" src="https://github.com/user-attachments/assets/82e2674e-a0b5-4cc1-b03d-c39bdc10e229" />
<img width="620" height="404" alt="image" src="https://github.com/user-attachments/assets/a71839cc-fc3d-4efa-a289-c9df562fdf2c" />

## Stack de Tecnologías:
FrontEnd: React 19, Axios para HTTP, Leaflet + React-Leaflet, Create React App  
BackEnd: Node.js, Express 5, CORS, Mongoose 8, Node-Geocoder.

## Instrucciones de Instalación y Ejecución Local:
- Node.js  
- MongoDB ejecutando local (puerto 27017)

## Ejecución local
1. proyecto descomprimido  
2. ingresar a iniciar.bat que está especializado para windows o en su defecto por linux ejecutando iniciar.sh  
3. Se abre automático el backend como el frontend.
   - Backend → http://localhost:5000
   - Frontend → http://localhost:3000

## En dado caso que se quiera ingresar a la aplicación de forma alterna seguir estos pasos:

abrir dos terminales (cmd)

### 1. terminal 1 -backend:
Ingresar "la ubicación del archivo" para el backend finalizando la ubicación del archivo colocar.

ejemplo:  
cd /d D:\guias\proyecto_web/server  
a. npm install  
b. node index.js

### 2. Terminal 2 - Frontend:
ingresar: cd "la ubicación del archivo" para el backend finalizando la ubicación del archivo colocar /cliente

ejemplo:  
cd /d D:\guias\proyecto_web/cliente  
a. npm install  
b. npm start

## Funcionalidades Implementadas:
- Registro de nuevos paquetes.  
- Visualización de la dirección de entrega del paquete en el mapa.  
- Actualización del estado del paquete.  
- Rastreo de paquete por código único.  
- Visualizar toda la información del paquete desde la pagina de rastreo.

## Estructura de la API:

Método | Ruta | Descripción
-------|------|------------
POST | /cliente/src/services/paquetes.js | Crear un paquete
GET | /cliente/src/services/paquetes.js | Obtener los paquetes
GET | /cliente/src/services/paquetes.js | Buscar el paquete por el número de serie
PUT | /cliente/src/services/paquetes.js | Actualizar el estado del paquete
