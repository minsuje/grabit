import { ProgressComponent } from '@/components/ComponentSeong';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useParams } from 'react-router-dom';

function ChallengeInProgress() {
    const { mission_id } = useParams();

    return (
        <div className="container">
            <div className="text-center font-extrabold text-5xl p-3">데일리 미션</div>

            <ProgressComponent />
            <br />

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
