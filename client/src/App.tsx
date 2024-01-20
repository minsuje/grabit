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
import ChallengeList from './page/challenge/ChallengeList';
import ChallengeEdit from './page/challenge/ChallengeEdit';
import ChallengeDetail from './page/challenge/ChallengeDetail';
import '@/App.css';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    {/* 첫 화면 */}
                    <Route path="/" element={<Home />} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/main" element={<Main />} />
                    <Route path="/challengeInProgress/:challenge_id" element={<ChallengeInProgress />} />
                    <Route path="/register/normal" element={<Register />} />
                    {/* <Route path="/challengetear" element={<ChallengeTear />} /> */}
                    <Route path="/challengresult" element={<ChallengeResult />} />
                    <Route path="/challengeImage/:authentication_id" element={<ChallengeImage />} />
                    <Route path="/challengeList" element={<ChallengeList />} />
                    <Route path="/challengeEdit/:challenge_id" element={<ChallengeEdit />} />
                    <Route path="/challengeDetail/:challenge_id" element={<ChallengeDetail />} />

                    {/* 
                    <Route path="/challengeTear/:challenge_id" element={<ChallengeTear />} /> */}

                    <Route path="/challengeResult/:challenge_id" element={<ChallengeResult />} />

                    <Route path="/challengeNotice" element={<ChallengeNotice />} />
                    <Route path="/challengeCreate" element={<ChallengeCreate />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
