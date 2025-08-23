import { useMemo } from 'react';
import {
  type AnyFnPtInstance,
  type AnyFnPtObsProps,
  type ControlPtObsProps,
  BezierPoint,
} from '@/models/FnPaths';
import { usePoint } from '@/hooks/FnPaths';
import { map } from '@/utils';
import { useGraph } from './Graph.context';

type LinkProps = {
  beginPt: AnyFnPtInstance;
  endPt: AnyFnPtInstance;
  idx: number;
};

const Link = ({ beginPt, endPt, idx }: LinkProps) => {
  console.log(`render: link${idx}`);

  const cp1 = beginPt instanceof BezierPoint ? beginPt.nextCp : undefined;
  const cp2 = endPt instanceof BezierPoint ? endPt.prevCp : undefined;

  const beginPtObsable = usePoint(beginPt)! as AnyFnPtObsProps;
  const cp1Obsable = usePoint(cp1) as ControlPtObsProps | undefined;
  const cp2Obsable = usePoint(cp2) as ControlPtObsProps | undefined;
  const endPtObsable = usePoint(endPt)! as AnyFnPtObsProps;

  const { coordToPos } = useGraph();

  const d = useMemo(() => {
    const beginPos = coordToPos(beginPtObsable.coord);
    const endPos = coordToPos(endPtObsable.coord);
    let dStr = `M${beginPos[0]},${beginPos[1]}`;
    if ('exponent' in beginPtObsable) {
      const exponent = beginPtObsable.exponent;
      const resolution = 64;
      for (let n = 1; n <= resolution + 1; ++n) {
        const normalizedX = n / (resolution + 1);
        const powedY = Math.pow(normalizedX, exponent);
        const posX = map(normalizedX, 0, 1, beginPos[0], endPos[0]);
        const posY = map(powedY, 0, 1, beginPos[1], endPos[1]);
        dStr += ` L${posX},${posY}`;
      }
    } else if (cp1Obsable?.isUsable || cp2Obsable?.isUsable) {
      const [cp1PosX, cp1PosY] = cp1Obsable
        ? coordToPos(cp1Obsable.absCoord())
        : beginPos;
      const [cp2PosX, cp2PosY] = cp2Obsable
        ? coordToPos(cp2Obsable.absCoord())
        : endPos;
      dStr += ` C${cp1PosX},${cp1PosY} ${cp2PosX},${cp2PosY} ${endPos[0]},${endPos[1]}`;
    } else {
      dStr += ` L${endPos[0]},${endPos[1]}`;
    }
    return dStr;
  }, [coordToPos, beginPtObsable, cp1Obsable, cp2Obsable, endPtObsable]);

  return <path d={d} fill="none" stroke="black" strokeWidth={2} />;
};

export default Link;
