import { GradientGl } from '@/components/GradientGl';
import { Graph } from '@/components/Graph';
import { FnPaths, type PathsArry } from '@/models/FnPaths';
import { useRef } from 'react';

type LightnessProps = {
  pathsArray: PathsArry;
};

const Lightness = ({ pathsArray }: LightnessProps) => {
  const paths = useRef<FnPaths>(FnPaths.fromArray(pathsArray)).current;
  console.log(paths);

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
      <Graph paths={paths} />
    </div>
  );
};

export default Lightness;
