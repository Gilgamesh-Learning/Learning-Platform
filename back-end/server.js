const express = require('express');
const FileUpload = require('express-fileupload');
const { join, extname, dirname } = require('path');
const util = require('util');
const { spawn } = require('child_process');
const process = require('process');

const app = express();

app.use('/data', express.static('data'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

const fileUploadMiddleware = FileUpload({
    createParentPath: true,
});

const spawnPromise = (cmd, ...args) => new Promise((resolve, reject) => {
    const proc = spawn(cmd, args);

    proc.stdout.on('data', (data) => process.stdout.write(data));
    proc.stderr.on('data', (data) => process.stderr.write(data));

    proc.on('close', resolve);
    proc.on('error', reject);
})

const processFile = async (path) => {
    const dir = dirname(path);
    const processingScripts = join(dirname(require.main.filename), '..', 'processing-scripts');

    try {
        spawnPromise('ffmpeg', '-i', path, join(dir, 'audio.wav'));
    } catch(err) {
        console.error(err);
        return;
    }

    try {
        spawnPromise(
            'python3',
            join(processingScripts, 'transcribe', 'transcribe.py'),
            join(dir, 'audio.wav'),
            join(dir, 'splits.json'),
            join(dir, 'transcription.txt')
        );
    } catch(err) {
        console.error(err);
        return;
    }
}

app.post('/upload', fileUploadMiddleware, async (req, res) => {
    const file = req.files.file;
    const dataDir = join(dirname(require.main.filename), 'data');
    const path = join(dataDir, file.md5, 'original' + extname(file.name));

    if (file == null) res.sendStatus(400);

    file.mv(path);

    processFile(path);

    res.status(200).json({
        md5: file.md5,
    });
});

app.listen(8000, () => {
    console.log('App is running on port 8000')
});
