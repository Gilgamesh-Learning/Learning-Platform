const express = require('express');
const FileUpload = require('express-fileupload');
const { join, extname, dirname } = require('path');
const util = require('util');
const { spawn } = require('child_process');
const process = require('process');

const app = express();

const processingScripts = join(dirname(require.main.filename), '..', 'processing-scripts');
const dataDir = join(dirname(require.main.filename), 'data');



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/data', express.static(dataDir));

const fileUploadMiddleware = FileUpload({
    createParentPath: true,
});

const spawnPromise = (cmd, ...args) => new Promise((resolve, reject) => {
    const proc = spawn(cmd, args);

    const stdout = [];
    const stderr = [];

    proc.stdout.on('data', data => {
        stdout.push(data);
        process.stdout.write(data)
    });
    proc.stderr.on('data', data => {
        stderr.push(data);
        process.stderr.write(data);
    });

    proc.on('close', () => resolve({
        stdout: Buffer.concat(stdout),
        stderr: Buffer.concat(stderr),
    }));
    proc.on('error', () => reject());
})

const processFile = async (path) => {
    const dir = dirname(path);

    try {
        await spawnPromise('ffmpeg', '-i', path, join(dir, 'audio.wav'));
    } catch(err) {
        console.error(err);
        return;
    }

    try {
        await spawnPromise(
            'python3',
            join(processingScripts, 'transcribe', 'transcribe.py'),
            join(dir, 'audio.wav'),
            join(dir, 'splits.json'),
            join(dir, 'transcription.txt'),
        );
    } catch(err) {
        console.error(err);
        return;
    }
}

app.get('/search/:md5/:query', async (req, res) => {
    const dir = join(dataDir, req.params.md5)

    try {
        const { stdout } = await spawnPromise(
            'python3',
            join(processingScripts, 'smart_finder', 'find_word_in.py'),
            join(dir, 'splits.json'),
            join(dir, req.params.query),
        );
        res.json(stdout);
    } catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post('/upload', fileUploadMiddleware, async (req, res) => {
    const file = req.files.file;
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
