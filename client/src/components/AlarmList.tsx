function AlarmList({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-grabit-100 flex flex-col gap-2 rounded-md p-6">
      <span className="flex text-lg font-bold">{title}</span>
      <p className="flex">{content}</p>
    </div>
  );
}

export default AlarmList;
