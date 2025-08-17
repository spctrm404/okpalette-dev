import { Point } from './Point'; // Importing the subject

type prop = {
  point: Point;
  idx: number;
};

const CtrlPointXComp = ({ point, idx }: prop) => {
  console.log('render CtrlPointXComp', idx);

  const changeState = () => {
    point.x += 1;
  };

  return (
    <div>
      <button onClick={changeState}>Inc X</button>
    </div>
  );
};

export default CtrlPointXComp;
