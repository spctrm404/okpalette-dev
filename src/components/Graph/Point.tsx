import { BezierPoint } from '@MODELS/Paths';
import { ExponentPoint } from '@MODELS/Paths';
import type { PointInstance } from '@MODELS/Paths';
import { useGraph } from './Graph.context';
import { map } from '@/utils';

type PointProps = {
  point: PointInstance;
};

const Point = ({ point }: PointProps) => {
  const { coordToPos } = useGraph();

  const [posX, posY] = coordToPos(point.coord);

  const controlPoint = () => {
    if (point instanceof BezierPoint) {
      const isCp1Active = point.prevCp.isActive;
      const [cp1X, cp1Y] = coordToPos(point.prevCp.absCoord);
      const isCp2Active = point.nextCp.isActive;
      const [cp2X, cp2Y] = coordToPos(point.nextCp.absCoord);
      return (
        <>
          {isCp1Active && (
            <path d={`M${posX},${posY} L${cp1X},${cp1Y}`} stroke="blue" />
          )}
          {isCp2Active && (
            <path d={`M${posX},${posY} L${cp2X},${cp2Y}`} stroke="blue" />
          )}
          {isCp1Active && <circle cx={cp1X} cy={cp1Y} r={6} fill="blue" />}
          {isCp2Active && <circle cx={cp2X} cy={cp2Y} r={6} fill="blue" />}
        </>
      );
    }
    return null;
  };

  return (
    <>
      <circle cx={posX} cy={posY} r={12} />
      {controlPoint()}
    </>
  );
};

export default Point;
