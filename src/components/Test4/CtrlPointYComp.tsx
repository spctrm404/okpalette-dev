import type { AnyFnPtInstance } from '@/models/FnPaths';

type prop = {
  point: AnyFnPtInstance;
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
