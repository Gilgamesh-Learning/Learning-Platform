import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import { toast} from 'react-toastify';
import ReactPlayer from 'react-player'

import './style.css';

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

    return (
        <form method="post" action="#" id="#" onSubmit={onSubmit}>

            {!hidden ?

              <ReactPlayer

         className='react-player'
         url= 'https://www.youtube.com/watch?v=BimpNou0orc'
      
         />

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
