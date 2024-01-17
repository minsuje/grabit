import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function CreateChallenge() {
    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-start-1 col-span-2 font-bold text-xl ">주제</div>
                <div className="col-start-1 col-span-1">
                    <Select>
                        <SelectTrigger className="w-[100%]">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <input className="col-start-2 col-span-2 p-2" placeholder="이름" />
            </div>
        </>
    );
}

function Tab() {
    return (
        <div className="w-[100%]">
            <Tabs defaultValue="account" className="w-[100%]">
                <TabsList>
                    <TabsTrigger value="account">나</TabsTrigger>
                    <TabsTrigger value="password">상대</TabsTrigger>
                </TabsList>
                <TabsContent value="account">내가 업로드한 사진</TabsContent>
                <TabsContent value="password">상대가 업로드한 사진</TabsContent>
            </Tabs>
        </div>
    );
}
const recordData = [29, 19, 3];
function Record() {
    return (
        <>
            <div className="flex justify-between text-xl">
                <div className="font-bold p-2">전적</div>
                <div className="p-2">
                    {recordData[0]}승 {recordData[1]}패 {recordData[2]}무
                </div>
            </div>
        </>
    );
}

const hotChallenge = ['물마시기', '걷기', '공부'];
function HotChallenge() {
    return (
        <>
            <div className="font-bold text-xl p-2">인기 챌린지</div>
            <div className="flex gap-8 text-center">
                {hotChallenge.map((value) => {
                    return <div className="rounded-lg bg-slate-100 w-[30%] m-2 p-2">{value}</div>;
                })}
            </div>
        </>
    );
}
export { CreateChallenge, Tab, Record, HotChallenge };
