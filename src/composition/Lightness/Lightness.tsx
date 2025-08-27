import { FnPaths } from '@/models/FnPaths';
import { GradientGl } from '@/components/GradientGl';
import { Graph } from '@/components/Graph';

type LightnessProps = {
  paths: FnPaths;
};

const Lightness = ({ paths }: LightnessProps) => {
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
      <Graph paths={paths} coordRangeY={[0, 100]} />
    </div>
  );
};

export default Lightness;
