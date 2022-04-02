const express = require('express');
const FileUpload = require('express-fileupload');

const app = express();
const path = require('path');

app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

const fileUploadMiddleware = FileUpload({
    createParentPath: true,
});

app.post('/videos', fileUploadMiddleware, (req, res) => {
    const file = req.files.file;
    const dataDir = path.join(require.main.filename, '..', 'data');
    if (file == null) res.sendStatus(400);
    file.mv(path.join(dataDir, file.name));
    res.status(200).json({
        filename: file.name,
    });
});

app.listen(8000, () => {
    console.log('App is running on port 8000')
});
