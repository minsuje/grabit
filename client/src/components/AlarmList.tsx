function AlarmList({ title, content }) {
    return (
        <div className="flex flex-col gap-2 p-6 bg-stone-100 rounded-md">
            <span className="flex text-lg font-bold">{title}</span>
            <p className="flex">{content}</p>
        </div>
    );
}

export default AlarmList;
