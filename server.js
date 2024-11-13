const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
const PORT = 3000;

// Подключаем middleware для обработки файлов
app.use(fileUpload());

// Настраиваем директорию для статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для загрузки файла
app.post('/upload', async (req, res) => {
    try {
        // Проверяем, что файлы были загружены
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'Файлы не были загружены' });
        }

        // Проверка на наличие файла с ключом 'file'
        const uploadedFile = req.files.file;
        if (!uploadedFile) {
            return res.status(400).json({ error: 'Отсутствует файл с ключом "file"' });
        }

        // Проверяем тип файла
        const allowedExtensions = /png|jpg|jpeg/;
        const fileExtension = path.extname(uploadedFile.name).toLowerCase();
        if (!allowedExtensions.test(fileExtension)) {
            return res.status(400).json({ error: 'Неподдерживаемый тип файла' });
        }

        // Сохраняем файл в директорию uploads
        const uploadPath = path.join(__dirname, 'uploads', uploadedFile.name);

        // Перемещаем файл в указанное место
        uploadedFile.mv(uploadPath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка при сохранении файла' });
            }

            // Отправляем успешный ответ
            res.status(200).json({ message: 'Файл успешно загружен', filePath: uploadPath });
        });
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ error: 'Произошла внутренняя ошибка сервера' });
    }
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
