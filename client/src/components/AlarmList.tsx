function AlarmList({ title, content }: { title: string; content: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-md bg-stone-100 p-6">
      <span className="flex text-lg font-bold">{title}</span>
      <p className="flex">{content}</p>
    </div>
  );
}

export default AlarmList;
