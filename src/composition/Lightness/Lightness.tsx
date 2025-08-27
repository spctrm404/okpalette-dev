import React, { useState } from 'react';
import { FnPaths } from '@/models/FnPaths';
import { GradientGl } from '@/components/GradientGl';
import { Graph } from '@/components/Graph';

type LightnessProps = {
  paths: FnPaths;
};

const Lightness = ({ paths }: LightnessProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelectThumb = (index: number) => {
    setSelectedIndex(index);
    console.log('Selected thumb index:', index);
  };

  return (
    <div>
      <GradientGl
        l={{
          source: 'x',
          min: 0.0,
          max: 1.0,
          fnType: 'pow',
          powVal: 1 / 2.2,
        }}
        c={{
          source: 'const',
          min: 0.0,
          max: 0.4,
          constVal: 0.0,
        }}
        h={{
          source: 'const',
          min: 0.0,
          max: 360.0,
          constVal: 0.0,
        }}
      />
      <Graph
        paths={paths}
        coordRangeY={[0, 100]}
        onSelectThumb={handleSelectThumb}
      />
      선택된 인덱스: {selectedIndex}
    </div>
  );
};

export default Lightness;
