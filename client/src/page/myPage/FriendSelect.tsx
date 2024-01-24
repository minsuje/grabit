import FriendList from '@/components/FriendList';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { friendSlice } from '@/store/store';

const friends = [
    {
        id: 1,
        name: '라마',
        profile_img: 'https://github.com/shadcn.png',
    },
    {
        id: 2,
        name: '람마',
        profile_img: 'https://github.com/shadcn.png',
    },
    {
        id: 3,
        name: '마라',
        profile_img: 'https://github.com/shadcn.png',
    },
];

function FriendSelect() {
    const dispatch = useDispatch();
    const data = useSelector((state) => state);
    console.log(data);

    const [selectFriend, setSelectFriend] = useState(new Set());

    // useEffect(() => {
    //     setSelectFriend(data);
    // }, [data]);

    const checkItemHandler = (id: number, isChecked: boolean) => {
        if (isChecked) {
            selectFriend.add(id);
            setSelectFriend(selectFriend);
            console.log(selectFriend);
        } else if (!isChecked) {
            selectFriend.delete(id);
            setSelectFriend(selectFriend);
        }
    };

    function handleSelect() {
        console.log('선택된 친구 목록', selectFriend);
        dispatch(friendSlice.actions.updateFriend(selectFriend));
        // setSelectFriend([]); // 선택된 친구 목록 초기화하기
        // 선택된 친구 목록을 저장하고 싶은 경우에는 아래와 같이 처리할 수 있습니다.
        // const selectedFriends = friends.filter((friend) => selectFriend.includes(friend.id));
        // dispatch(friendSlice.actions.addFriend(selectedFriends));
        // setSelectFriend([]); // 선택된 친구 목록
        console.log(data);
    }

    return (
        <div>
            <h1>친구 목록</h1>
            <form>
                {friends.map((friend) => (
                    <div key={friend.id} className="friendItem flex gap-2 items-center">
                        <Checkbox id={'FriendItem' + friend.id} onCheckedChange={() => handleSelect} />
                        <label htmlFor={'FriendItem' + friend.id}>
                            <FriendList friend={friend} />
                        </label>
                    </div>
                ))}
            </form>
        </div>
    );
}

export default FriendSelect;
