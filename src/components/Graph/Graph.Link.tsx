import { useMemo } from 'react';
import type { PointInstance } from '@/models/Paths';
import { BezierPoint } from '@/models/Paths';
import { ExponentPoint } from '@/models/Paths';
import { usePoint } from '@/hooks/Paths';
import { map } from '@/utils';
import { useGraph } from './Graph.context';

type LinkProps = {
  beginPoint: PointInstance;
  endPoint: PointInstance;
  idx: number;
};

const Link = ({ beginPoint, endPoint, idx }: LinkProps) => {
  console.log(`render: link${idx}`);

  const cp1 = beginPoint instanceof BezierPoint ? beginPoint.nextCp : null;
  const cp2 = endPoint instanceof BezierPoint ? endPoint.prevCp : null;

  const trgBeginPt = usePoint(beginPoint);
  const trgCp1 = usePoint(cp1);
  const trgCp2 = usePoint(cp2);
  const trgEndPt = usePoint(endPoint);

  const { coordToPos } = useGraph();

  const d = useMemo(() => {
    const beginPos = coordToPos(beginPoint.coord);
    const endPos = coordToPos(endPoint.coord);
    let dStr = `M${beginPos[0]},${beginPos[1]}`;
    if (beginPoint instanceof ExponentPoint) {
      const exponent = beginPoint.exponent;
      const resolution = 64;
      for (let n = 1; n <= resolution + 1; ++n) {
        const normalizedX = n / (resolution + 1);
        const powedY = Math.pow(normalizedX, exponent);
        const posX = map(normalizedX, 0, 1, beginPos[0], endPos[0]);
        const posY = map(powedY, 0, 1, beginPos[1], endPos[1]);
        dStr += ` L${posX},${posY}`;
      }
    } else if (cp1?.isUsable || cp2?.isUsable) {
      const [cp1PosX, cp1PosY] = cp1 ? coordToPos(cp1.absCoord) : beginPos;
      const [cp2PosX, cp2PosY] = cp2 ? coordToPos(cp2.absCoord) : endPos;
      dStr += ` C${cp1PosX},${cp1PosY} ${cp2PosX},${cp2PosY} ${endPos[0]},${endPos[1]}`;
    } else {
      dStr += ` L${endPos[0]},${endPos[1]}`;
    }
    return dStr;
  }, [coordToPos, trgBeginPt, trgCp1, trgCp2, trgEndPt]);

  return <path d={d} fill="none" stroke="black" strokeWidth={2} />;
};

export default Link;
