import { ProgressComponent } from '@/components/ComponentSeong';
import { Tab } from '@/components/Component0117';
import { Button } from '@/components/ui/button';
import { ListComponent2 } from '@/components/ComponentSeong';
import ChallengeData from '@/data/ChallengeData';

export function ChallengeResult() {
    console.log(ChallengeData);

    return (
        <>
            <div>
                <h1>축하합니다.</h1>
            </div>

            <div className="container">
                <div className="text-center font-extrabold text-5xl p-3">30,000 원</div>
                <div className="grid grid-cols-2 gap-4 text-center p-1 m-10">
                    <h1 className="font-black text-2xl">나</h1>
                    <h1 className="font-black text-2xl">상대</h1>
                    <p>3회 성공</p>
                    <p>5회 성공</p>
                    <p>+3000</p>
                    <p>-3000</p>
                    <p>+100P</p>
                    <p>-50P</p>
                </div>
                <div className="grid grid-cols-2 gap-2 place-content-center  text-center">
                    <div>
                        <p>티어</p>
                        <img src="" alt="" />
                        이미지
                    </div>
                    <div>
                        <p>티어</p>
                        <img src="" alt="" />
                        이미지
                    </div>
                </div>
                나 :<ProgressComponent />
                상대 :<ProgressComponent />
                <br />
                <ListComponent2 challenge={ChallengeData[0]} />
                <div className="text-center ">
                    <Button>확인</Button>
                </div>
            </div>
        </>
    );
}
