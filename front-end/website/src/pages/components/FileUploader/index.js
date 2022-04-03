import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { toast} from 'react-toastify';
import ReactPlayer from 'react-player'

import './style.css';

const canvasLoad = () => {
    console.log('sdjslakjdlksa');
    const c = document.getElementById('video-canvas');
    const ctx = c.getContext('2d');
}

export const FileUploader = ({onSuccess}) => {
    const [files, setFiles] = useState([]);
    const [hidden, setHidden] = useState(true);
    const [disable, setDisable] = useState(false);

    const onInputChange = (e) => {
        setFiles(e.target.files)
    };

    function rem() {
      setHidden(s => !s)
      setDisable(true)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();

        for(let i = 0; i < files.length; i++) {
            data.append('file', files[i]);
        }

        axios.post('//localhost:8000/upload', data)
            .then((response) => {
                toast.success('Upload Success');
                onSuccess(response.data)
            })
            .catch((e) => {
                toast.error('Upload Error')
            })
    };

    function canvasDraw(data) {
        let canvas = document.getElementById('hotness');
        let ctx = canvas.getContext('2d');

        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        data.sort((a, b) => {return a.start - b.start;});

        for(const point of data) {
            const mid = (point.start + point.end) / 2;
            ctx.lineTo(canvas.width * mid, canvas.height * (1 - point.match));
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.stroke();
    }


    useEffect(() => {
        console.log("WHAT");
        if(hidden) {
            return;
        }
        const canvas = document.getElementById('video-canvas');
        console.log(canvas);
        const ctx = canvas.getContext('2d');

        document.draw = (val) => {
            let canvas = document.getElementById('video-canvas');
            let ctx = canvas.getContext('2d');

            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);

            data.sort((a, b) => {return a.start - b.start;});

            for(const point of data) {
                const mid = (point.start + point.end) / 2;
                ctx.lineTo(canvas.width * mid, canvas.height * (1 - point.match));
            }

            ctx.lineTo(canvas.width, canvas.height);
            ctx.stroke();
        }

        canvas.addEventListener('mousedown', (event) => {
            let canvas = document.getElementById('video-canvas');
            let ctx = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const video = document.getElementById('video-player');
            video.currentTime = video.duration * y / canvas.width;
        });
   });


    return (
        <form method="post" action="#" id="#" onSubmit={onSubmit}>

            {!hidden ?
                <div>
                    <video autoPlay playsInline id="video-player">
                        <source src="http://localhost:8000/data/8d5eecc2c4e2adb20daabc39d9ab2e9b/original.mp4"/>
                    </video>
                    <canvas id="video-canvas"> </canvas>
                </div>
              :
            <div className="form-group files">
            <label>Upload Your File </label>
            <input type="file"
            onChange={onInputChange}
            className="form-control"
            multiple/>
            </div>
          }
        <button type = "button" class = "gradient-button" disabled={disable} onClick={rem}> Submit </button>


        </form>
    )
};

