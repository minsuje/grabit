import axios from 'axios';

function FileUploadTest() {
    async function handleUpload() {
        const result = await axios({
            method: 'post',
            url: 'http://localhost:3000/challengeAuth/10',
        });

        console.log(result);
    }
    return (
        <div>
            <input type="file" />
            <button onClick={handleUpload}>업로드</button>
        </div>
    );
}

export default FileUploadTest;
