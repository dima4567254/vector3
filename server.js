const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Настройка express для обработки загрузки файлов
app.use(fileUpload());

// Указываем директорию для статических файлов (например, для HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Роут для обработки загрузки файлов
app.post('/upload', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
        const outputDir = path.join(__dirname, 'output');

        // Создаем директорию для сохранения файлов, если ее нет
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // Перебираем файлы и сохраняем их
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filePath = path.join(outputDir, file.name);

            // Сохраняем файл
            await file.mv(filePath);
            console.log(`File saved: ${filePath}`);
        }

        res.send('Files have been uploaded and processed.');
    } catch (error) {
        console.error('Error during file upload:', error);
        res.status(500).send('There was an error processing your file.');
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
