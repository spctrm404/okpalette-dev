import { Point } from './Point'; // Importing the subject

type prop = {
  point: Point;
  idx: number;
};

const CtrlPointYComp = ({ point, idx }: prop) => {
  console.log('render CtrlPointYComp', idx);

  const changeState = () => {
    point.y += 1;
  };

  return (
    <div>
      <button onClick={changeState}>Inc Y</button>
    </div>
  );
};

export default CtrlPointYComp;
