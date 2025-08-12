import type { Vec2 } from '@TYPES/index';
import { SizeProvider } from '@/contexts/size';
import { PathProvider } from '@/contexts/path';
import { useRef, useState } from 'react';
import Child from './Child';

const Graph = ({ pathArray }: { pathArray: number[][] }) => {
  const sizeStates = useState<Vec2>([0, 0]);
  const [[w, h]] = sizeStates;
  const elemRef = useRef<SVGSVGElement>(null);
  return (
    <svg
      ref={elemRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${w} ${h}`}
      style={{
        display: 'block',
        touchAction: 'none',
        overscrollBehavior: 'contain',
        width: '100%',
        height: '100%',
      }}
    >
      <SizeProvider elemRef={elemRef} sizeStates={sizeStates}>
        <PathProvider pathArray={pathArray}>
          <Child />
        </PathProvider>
      </SizeProvider>
    </svg>
  );
};

export default Graph;
