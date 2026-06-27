/**
* Project     : Sample Vault
* Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
* License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
* Date        : Marzo 2026
*/

const path = require('path');
const fileHelper = require('../utils/fileHelper');
const sampleRepo = require('../repositories/sampleRepo');

class SampleController 
{
    async uploadSample(req, res) 
    {
        try
        {
            // 1. Validación de archivo base
            if (!req.file) {
                return res.status(400).json({
                    message: "No se subió ningún archivo o el formato es inválido."
                });
            }

            const { display_name, category, bpm } = req.body;

            if (!display_name || !category) {
                try {
                    fileHelper.deleteFile(req.file.path);
                } catch (e) {}

                return res.status(400).json({
                    message: "El nombre y la categoría son obligatorios."
                });
            }

            // ===== VALIDACIÓN MIME (MULTER - REQUERIDO POR CONSIGNA) =====
            const allowedMime = [
                'audio/mpeg',
                'audio/wav',
                'audio/ogg',
                'audio/flac'
            ];

            if (!allowedMime.includes(req.file.mimetype)) {

                try {
                    fileHelper.deleteFile(req.file.path);
                } catch (e) {}

                return res.status(415).json({
                    message: "El archivo no es un audio válido."
                });
            }
            // ============================================================

            const userId = req.userId;

            const filePath = `/uploads/${req.file.filename}`;

            const insertId = await sampleRepo.create({
                user_id: userId,
                filename: req.file.filename,
                display_name,
                category,
                bpm: parseInt(bpm) || 0,
                file_path: filePath
            });

            return res.status(201).json({
                message: "Sample cargado exitosamente en la biblioteca.",
                id: insertId,
                path: filePath
            });
        }
        catch (error)
        {
            try {
                if (req.file) fileHelper.deleteFile(req.file.path);
            } catch (e) {}

            return res.status(500).json({
                message: "Error durante la carga del sample.",
                error: error.message
            });
        }
    }

    async getMySamples(req, res)
    {
        try
        {
            const samples = await sampleRepo.findByUserId(req.userId);
            return res.json(samples);
        }
        catch (error)
        {
            return res.status(500).json({
                message: "Error al recuperar la biblioteca.",
                error: error.message
            });
        }
    }

    async deleteSample(req, res)
    {
        try
        {
            const { id } = req.params;
            const userId = req.userId;

            const sample = await sampleRepo.findById(id, userId);

            if (!sample) {
                return res.status(404).json({
                    message: "El sample no existe o no tienes permisos para eliminarlo."
                });
            }

            await sampleRepo.delete(id, userId);

            fileHelper.deleteFile(sample.file_path);

            return res.json({
                message: "Registro eliminado y archivo físico removido con éxito."
            });
        }
        catch (error)
        {
            return res.status(500).json({
                message: "Error al eliminar el sample.",
                error: error.message
            });
        }
    }
}

module.exports = new SampleController();