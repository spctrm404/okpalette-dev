import { useSize } from '@/contexts/size';
import { usePath } from '@/contexts/path';

const Child = () => {
  const { size } = useSize();
  const { path, renderTrigger } = usePath();

  console.log(renderTrigger);
  console.log(path);

  return (
    <text x="20" y="35" fontSize={30}>
      {`${size[0]}, ${size[1]}`}
    </text>
  );
};

export default Child;
