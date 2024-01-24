import axios from 'axios';
import { useEffect, useState } from 'react';

function FileUploadTest() {
    const [file, setFile] = useState<File>();
    const [profile, setProfile] = useState<string>('');

    useEffect(() => {
        handleGet();
    });

    async function handleUpload() {
        console.log('axios', file);

        await axios({
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
                    'Content-Type': file?.type,
                },
            }).then((res) => {
                console.log(res);
            });
        });
    }

    async function handleUpdate() {
        await axios({
            method: 'patch',
            url: 'http://localhost:3000/challengeAuth/1/50',
            data: {
                filename: file?.name,
                type: file?.type,
            },
        }).then((res) => {
            console.log('patch res.data', res);
            axios({
                method: 'put',
                url: res.data,
                data: file,
                headers: {
                    'Content-Type': file?.type,
                },
            });
        });
    }

    async function handleGet() {
        await axios({
            method: 'get',
            url: 'http://localhost:3000/challengeAuth/1/50',
        }).then((res) => {
            console.log(res.data);
            setProfile(res.data);
        });
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e.target.files![0]);
        setFile(e.target.files![0]);
    }

    async function handleDelete() {
        await axios({
            method: 'delete',
            url: 'http://localhost:3000/challengeAuth/1/50',
        }).then((res) => {
            alert('삭제 완료!');
        });
    }

    return (
        <div>
            <img src={profile} width={450} />
            <input type="file" onChange={handleChange} />
            <br />
            <br />
            <div className="flex gap-2">
                <button onClick={handleUpload} className="p-3 bg-blue-500 text-white rounded-md">
                    업로드
                </button>
                <br />
                <button onClick={handleUpdate} className="p-3 bg-blue-500 text-white rounded-md">
                    업데이트
                </button>
                <br />
                <button onClick={handleDelete} className="p-3 bg-blue-500 text-white rounded-md">
                    삭제
                </button>
            </div>
        </div>
    );
}

export default FileUploadTest;
