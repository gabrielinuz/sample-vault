/**
*    Project     : Sample Vault
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Marzo 2026
*/

/**
 * Carga las variables del archivo .env 
 * Un archivo .env es un archivo de texto plano utilizado 
 * en el desarrollo de software para almacenar variables de entorno 
 * y credenciales sensibles (claves API, credenciales de bases de datos, 
 * tokens) fuera del código fuente. Se sitúa en la raíz del proyecto, 
 * usa pares clave-valor y nunca debe subirse al control de versiones (Git). 
 */
 require('dotenv').config();

/**
 * Express es un framework web minimalista, rápido y flexible para Node.js, 
 * diseñado para facilitar la creación de aplicaciones back-end y APIs. 
 * Proporciona una capa ligera de características fundamentales, \
 * como el enrutamiento y la gestión de middleware, \
 * permitiendo construir servidores web de manera eficiente \
 * sin imponer estructuras rígidas.
 */
const express = require('express');
/**
 * Módulo/Biblioteca que permite peticiones desde el origen del frontend:
 */
const cors = require('cors');
/**
 * Módulo/Biblioteca para el manejo de rutas:
 */
const path = require('path');
/**
 * Módulo/Biblioteca para el manejo del filesystem:
 */
const fs = require('fs');

/**
 * Importar las rutas definidas arriba
 */
const authRoutes = require('./routes/authRoutes');
const sampleRoutes = require('./routes/sampleRoutes');
const adminRoutes = require('./routes/adminRoutes');

/**
 * Instancia de express como objeto app.
 */
const app = express();

// --- Middlewares ---
app.use(cors());// Permite peticiones desde el origen del frontend
app.use(express.json());// Analiza cuerpos JSON en las peticiones
app.use(express.urlencoded({ extended: true }));// Analiza datos de formularios estándar

// --- Configuración de Carpetas y Rutas Estáticas ---

// 1. Carpeta de subidas (Audios) Crear 'uploads' si no existe al iniciar el server
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// 2. Servir TODO el frontend (esto permite que el HTML acceda a ../css y ../js)
// Servir archivos estáticos del FRONTEND
// Como server.js está en /backend, subimos un nivel para encontrar /frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// --- Registrar rutas de la API ---
// IMPORTANTE: Las rutas de la API deben ir antes de las rutas de navegación 
// para evitar que el comodín '*' las capture accidentalmente.
app.use('/api/auth', authRoutes);// Prefijo para autenticación
app.use('/api/samples', sampleRoutes);// Prefijo para gestión de audios
app.use('/api/admin', adminRoutes);// Prefijo para gestión del admin

// --- Rutas de Navegación del Frontend HTML ---

// Al entrar a http://localhost:3000/ cargamos login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/login.html'));
});

// Rutas amigables para las pantallas:
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/register.html'));
});

app.get('/producer-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/producer-dashboard.html'));
});

app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/admin-dashboard.html'));
});

// Captura de rutas inexistentes (404)
app.use((req, res) => {
    // Si la petición pide un archivo (tiene extensión), mejor devolver un 404 seco
    // para no romper el debug de scripts/estilos.
    // if (req.path.includes('.')) {
    //     return res.status(404).send('Recurso no encontrado');
    // }

    // Si es una ruta de navegación (ej: /loquesea), servimos el login
    res.status(404).sendFile(path.join(__dirname, '../frontend/html/login.html'));
});

// --- Manejo de errores global ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Error en el servidor", error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`🚀 SampleVault listo en:`);
    console.log(`   Punto de entrada: http://localhost:${PORT}`);
    console.log(`==========================================`);
});