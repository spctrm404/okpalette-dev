import { BezierPoint } from '@MODELS/Paths';
import { ExponentPoint } from '@MODELS/Paths';
import type { PointInstance } from '@MODELS/Paths';
import { useGraph } from './Graph.context';
import { map } from '@/utils';

type LinkProps = {
  beginPoint: PointInstance;
  endPoint: PointInstance;
};

const Link = ({ beginPoint, endPoint }: LinkProps) => {
  const { coordToPos } = useGraph();

  const [beginPosX, beginPosY] = coordToPos(beginPoint.coord);
  const [endPosX, endPosY] = coordToPos(endPoint.coord);

  const d = () => {
    let dStr = `M${beginPosX},${beginPosY}`;
    if (beginPoint instanceof ExponentPoint) {
      const exponent = beginPoint.exponent;
      const resolution = 64;
      for (let n = 1; n <= resolution + 1; ++n) {
        const normalizedX = n / (resolution + 1);
        const powedY = Math.pow(normalizedX, exponent);
        const posX = map(normalizedX, 0, 1, beginPosX, endPosX);
        const posY = map(powedY, 0, 1, beginPosY, endPosY);
        dStr += ` L${posX},${posY}`;
      }
    } else if (
      beginPoint instanceof BezierPoint ||
      endPoint instanceof BezierPoint
    ) {
      const cp1Coord =
        beginPoint instanceof BezierPoint && beginPoint.nextCp.isUsable
          ? beginPoint.nextCp.absCoord
          : beginPoint.coord;
      const [cp1PosX, cp1PosY] = coordToPos(cp1Coord);
      const cp2Coord =
        endPoint instanceof BezierPoint && endPoint.prevCp.isUsable
          ? endPoint.prevCp.absCoord
          : endPoint.coord;
      const [cp2PosX, cp2PosY] = coordToPos(cp2Coord);
      dStr += ` C${cp1PosX},${cp1PosY} ${cp2PosX},${cp2PosY} ${endPosX},${endPosY}`;
    } else {
      dStr += ` L${endPosX},${endPosY}`;
    }
    return dStr;
  };
  return <path d={d()} fill="none" stroke="black" strokeWidth={2} />;
};

export default Link;
