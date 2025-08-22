import type { AnyPoint } from '@/models/FnPath';

type prop = {
  point: AnyPoint;
  idx: number;
};

const CtrlPointYComp = ({ point, idx }: prop) => {
  console.log('render CtrlPointYComp', idx);

  const changeState = () => {
    const [x, y] = point.coord;
    point.coord = [x, y + 1];
  };

  return (
    <div>
      <button onClick={changeState}>Inc Y</button>
    </div>
  );
};

export default CtrlPointYComp;
