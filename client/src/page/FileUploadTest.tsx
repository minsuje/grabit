import axios from 'axios';
import { useState } from 'react';


function FileUploadTest() {
    const [file, setFile] = useState<File>();

    async function handleUpload() {
        console.log('axios', file);

        const result = await axios({
            method: 'post',
            url: 'http://localhost:3000/challengeAuth/1',
            data: {
                filename: file?.name,
                type: file?.type,
            },
        }).then((res) => {
            axios({
                method: 'put',
                url: res.data,
                data: file,
                headers: {
                    "Content-Type": file?.type,
                  },
    
            })
            .then((res) => {
                console.log(res);
            })
        })


        

    }



    function handleChange(e: any) {
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
    }
    return (
        <div>
            <input type="file" onChange={handleChange} />
            <button onClick={handleUpload}>업로드</button>
        </div>
    );
}

export default FileUploadTest;
