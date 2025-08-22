import type { AnyPoint } from '@/models/FnPath';

type prop = {
  point: AnyPoint;
  idx: number;
};

const CtrlPointXComp = ({ point, idx }: prop) => {
  console.log('render CtrlPointXComp', idx);

  const changeState = () => {
    const [x, y] = point.coord;
    point.coord = [x + 1, y];
  };

  return (
    <div>
      <button onClick={changeState}>Inc X</button>
    </div>
  );
};

export default CtrlPointXComp;
