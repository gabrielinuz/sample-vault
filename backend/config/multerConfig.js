/**
*    Project     : Sample Vault
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Marzo 2026
*/

const multer = require('multer');

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán físicamente
    },
    filename: (req, file, cb) => {
        // Renombramos el archivo: timestamp + nombre original
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// CAMBIO HECHO: ahora Multer SÍ valida el tipo MIME
const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',
        'audio/flac'
    ];

    // ✔ SOLO permite audios válidos
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // ❌ RECHAZA el archivo y genera error
        cb(new Error("El archivo no es un audio válido"), false);
    }
};

const upload = multer({ storage, fileFilter });

// 'audioFile' es el nombre del campo en el formulario
module.exports = upload.single('audioFile');