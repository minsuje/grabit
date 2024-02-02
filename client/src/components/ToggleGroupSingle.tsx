import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
interface hotTopicProp {
  hotTopic: string[];
}

export function ToggleGroupDemo({ hotTopic }: hotTopicProp) {
  console.log(hotTopic);
  return (
    <ToggleGroup type="single">
      {hotTopic.map((topic, idx) => {
        return (
          <ToggleGroupItem key={idx} value={topic} className="m-2 w-full rounded-md border-2 border-solid ">
            {topic}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}
