import { Tab } from '@/components/Component0117';
import { ListComponent1, ProgressComponent } from '@/components/ComponentSeong';
import ChallengeData from '../../data/ChallengeData';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useParams } from 'react-router-dom';

function ChallengeInProgress() {
    const { challenge_num } = useParams();

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

            <Tab />

            <div className="text-center ">
                <DropdownMenu>
                    <DropdownMenuTrigger>인증하기</DropdownMenuTrigger>
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
