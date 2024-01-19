import { Tab } from '@/components/Component0117';
import { ListComponent1, ProgressComponent } from '@/components/ComponentSeong';
import ChallengeData from '../../data/ChallengeData';
import { Button } from '@/components/ui/button';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, useParams } from 'react-router-dom';

function ChallengeInProgress() {
    const { challenge_num } = useParams();
    const myImage = (
        <div className="grid grid-cols-2">
            <Link to="/challengeImage/1">
                <div>
                    <img
                        className="m-auto rounded-lg w-[65%] h-[180px] mt-3"
                        src="https://health.chosun.com/site/data/img_dir/2023/07/17/2023071701753_0.jpg"
                    ></img>
                </div>
            </Link>

            <Link to="/challengeImage/1">
                <div>
                    <img
                        className="m-auto rounded-lg w-[65%] h-[180px] mt-3"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUYPdBcfX3qZIo067ZVvB21yz8l4iWExVJGg&usqp=CAU"
                    ></img>
                </div>
            </Link>
            <Link to="/challengeImage/1">
                <div>
                    <img
                        className="m-auto rounded-lg w-[65%] h-[180px] mt-3"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUYPdBcfX3qZIo067ZVvB21yz8l4iWExVJGg&usqp=CAU"
                    ></img>
                </div>
            </Link>
            <Link to="/challengeImage/1">
                <div>
                    <img
                        className="m-auto rounded-lg  w-[65%] h-[180px] mt-3"
                        src="https://health.chosun.com/site/data/img_dir/2023/07/17/2023071701753_0.jpg"
                    ></img>
                </div>
            </Link>
        </div>
    );
    const otherImage = (
        <div className="grid grid-cols-2">
            <Link to="/challengeImage/2">
                <div>
                    <img
                        className="m-auto rounded-lg w-[65%] h-[180px] mt-3"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUYPdBcfX3qZIo067ZVvB21yz8l4iWExVJGg&usqp=CAU"
                    ></img>
                </div>
            </Link>

            <Link to="/challengeImage/2">
                <div>
                    <img
                        className="m-auto rounded-lg w-[65%] h-[180px] mt-3"
                        src="https://health.chosun.com/site/data/img_dir/2023/07/17/2023071701753_0.jpg"
                    ></img>
                </div>
            </Link>
            <Link to="/challengeImage/2">
                <div>
                    <img
                        className="m-auto rounded-lg w-[65%] h-[180px] mt-3"
                        src="https://health.chosun.com/site/data/img_dir/2023/07/17/2023071701753_0.jpg"
                    ></img>
                </div>
            </Link>
            <Link to="/challengeImage/2">
                <div>
                    <img
                        className="m-auto rounded-lg w-[65%] h-[180px] mt-3"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUYPdBcfX3qZIo067ZVvB21yz8l4iWExVJGg&usqp=CAU"
                    ></img>
                </div>
            </Link>
        </div>
    );

    return (
        <div className="container">
            <div className="text-center font-extrabold text-5xl p-3">30,000 원</div>

            <div className="grid grid-cols-2 gap-4 text-center p-1 m-10">
                <div className="font-black text-2xl">나</div>
                <div className="font-black text-2xl">상대</div>
                <div>3회 성공</div>
                <div>5회 성공</div>
            </div>
            <ProgressComponent />
            <ProgressComponent />
            <br />
            <ListComponent1 challenge={ChallengeData[Number(challenge_num)]} />

            <Tab tab1="나" tab2="상대" tab1content={myImage} tab2content={otherImage} />

            <div className="text-center p-2 mt-5">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <span className=" bg-black text-white  p-3">인증하기</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem> 사진 촬영</DropdownMenuItem>
                        <DropdownMenuItem>사진 앨범</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
export default ChallengeInProgress;
