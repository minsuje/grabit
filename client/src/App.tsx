import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './page/challenge/main';
import ChallengeInProgress from './page/challenge/ChallengeInProgress';
import { Home } from './page/home/Home';
import { Register } from './page/home/Register';
import { Login } from './page/home/Login';
// import { motion } from 'framer-motion';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/main" element={<Main />} />
                    <Route path="/challengeInProgress/:challenge_num" element={<ChallengeInProgress />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
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
