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

  const beginPtProps = usePoint(beginPt)! as AnyFnPtObsProps;
  const cp1Props = usePoint(cp1) as ControlPtObsProps | undefined;
  const cp2Props = usePoint(cp2) as ControlPtObsProps | undefined;
  const endPtProps = usePoint(endPt)! as AnyFnPtObsProps;

  const { coordToPos } = useGraph();

  const d = useMemo(() => {
    const beginPos = coordToPos(beginPtProps.coord);
    const endPos = coordToPos(endPtProps.coord);
    let dStr = `M${beginPos[0]},${beginPos[1]}`;
    if ('exponent' in beginPtProps) {
      const exponent = beginPtProps.exponent;
      const resolution = 64;
      for (let n = 1; n <= resolution + 1; ++n) {
        const normalizedX = n / (resolution + 1);
        const powedY = Math.pow(normalizedX, exponent);
        const posX = map(normalizedX, 0, 1, beginPos[0], endPos[0]);
        const posY = map(powedY, 0, 1, beginPos[1], endPos[1]);
        dStr += ` L${posX},${posY}`;
      }
    } else if (cp1Props?.isUsable() || cp2Props?.isUsable()) {
      const [cp1PosX, cp1PosY] = cp1Props
        ? coordToPos(cp1Props.getAbsCoord())
        : beginPos;
      const [cp2PosX, cp2PosY] = cp2Props
        ? coordToPos(cp2Props.getAbsCoord())
        : endPos;
      dStr += ` C${cp1PosX},${cp1PosY} ${cp2PosX},${cp2PosY} ${endPos[0]},${endPos[1]}`;
    } else {
      dStr += ` L${endPos[0]},${endPos[1]}`;
    }
    return dStr;
  }, [coordToPos, beginPtProps, cp1Props, cp2Props, endPtProps]);

  return <path d={d} fill="none" stroke="black" strokeWidth={2} />;
};

export default Link;
