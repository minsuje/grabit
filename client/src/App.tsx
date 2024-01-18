import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Main from './page/challenge/Main';
import ChallengeInProgress from './page/challenge/ChallengeInProgress';
import { Home } from './page/home/home';
import { Register } from './page/home/Register';
import { Login } from './page/home/Login';
import { ChallengeTear } from '@/page/challenge/ChallengeTear';
// import { motion } from 'framer-motion';
import { ChallengeResult } from '@/page/challenge/challengeResult';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/main" element={<Main />} />
                    <Route path="/challengeInProgress/:challenge_num" element={<ChallengeInProgress />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/challengetear" element={<ChallengeTear />} />
                    <Route path="/challengResult" element={<ChallengeResult />} />
                    <Route path="/login" element={<Login />} />

                    {/*
                    <Route path="/challengeImage/:authentication_id" element={<ChallengeImage />} />
                    <Route path="/challengeTear/:challenge_num" element={<ChallengeTear />} />
                    <Route path="/challengeResult/:challenge_num" element={<ChallengeResult />} />

                    <Route path="/challengeNotice" element={<ChallengeNotice />} />
                    <Route path="/challengeCreate" element={<ChallengeCreate />} /> */}
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
