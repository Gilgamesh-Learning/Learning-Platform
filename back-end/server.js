const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const path = require('path');

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '//localhost:8000/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})


app.use(cors());
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({storage}).array('file');

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json(err)
        }

        return res.status(200).send(req.files)
    })
});

app.listen(8000, () => {
    console.log('App is running on port 8000')
});
