import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

type Friend = {
    id: number;
    name: string;
    profile_img: string;
};

type FriendListProps = {
    friend: Friend;
};

function FriendList({ friend }: FriendListProps) {
    return (
        <div className="flex gap-2 items-center">
            <Avatar>
                <AvatarImage src={friend.profile_img} />
                <AvatarFallback>{friend.name}</AvatarFallback>
            </Avatar>
            <p>{friend.name}</p>
        </div>
    );
}

export default FriendList;
