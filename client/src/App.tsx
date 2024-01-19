import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Main from './page/challenge/Main';
import ChallengeInProgress from './page/challenge/ChallengeInProgress';
import { Home } from './page/home/home';
import { Register } from './page/home/Register';
import { Login } from '@/page/home/Login';
import ChallengeNotice from './page/challenge/ChallengeNotice';
import ChallengeCreate from './page/challenge/ChallengeCreate';
// import { motion } from 'framer-motion';
import { ChallengeResult } from '@/page/challenge/challengeResult';
import ChallengeImage from './page/challenge/ChallengeImage';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    {/* 첫 화면 */}
                    <Route path="/" element={<Home />} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/main" element={<Main />} />
                    <Route path="/challengeInProgress/:challenge_num" element={<ChallengeInProgress />} />
                    <Route path="/register" element={<Register />} />
                    {/* <Route path="/challengetear" element={<ChallengeTear />} /> */}
                    <Route path="/challengresult" element={<ChallengeResult />} />
                    <Route path="/challengeImage/:authentication_id" element={<ChallengeImage />} />

                    {/* 
                    <Route path="/challengeTear/:challenge_num" element={<ChallengeTear />} /> */}
                    <Route path="/challengeResult/:challenge_num" element={<ChallengeResult />} />

                    <Route path="/challengeNotice" element={<ChallengeNotice />} />
                    <Route path="/challengeCreate" element={<ChallengeCreate />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
