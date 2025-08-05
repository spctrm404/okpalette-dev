import type { Path } from './components/Grapher/Grapher.types';
import { injectUuid } from './utils/list';
import GradientGl from './components/GradientGl/GradientGl';
import Grapher from './components/Grapher/Grapher';
import { useState } from 'react';
import './App.css';

const initialPath: Path = [
  {
    vals: [0, 0],
  },
  {
    vals: [0.25, 0.5],
    relCp1Vals: [1, 0],
    relCp2Vals: [0, 1],
  },
  {
    vals: [0.5, 0.25],
    relCp1Vals: [1, 0],
    exponent: 1 / 2.2,
  },
  {
    vals: [1, 1],
  },
];

function App() {
  const uuidInjectedPath = injectUuid(initialPath) as Path;
  const [path, setPath] = useState(uuidInjectedPath);

  return (
    <>
      <div style={{ width: '400px', aspectRatio: '4/3' }}>
        <Grapher path={path} onChange={setPath} />
      </div>
      <div>
        <ul>
          {path.map((aPoint, index) => (
            <li key={`point-info-${index}`}>
              Point {index + 1}: ({aPoint.vals[0].toFixed(2)},{' '}
              {aPoint.vals[1].toFixed(2)})
            </li>
          ))}
        </ul>
        <div>
          {path.map((aPoint, index) => (
            <div key={`point-input-${index}`}>
              <input
                type="number"
                value={aPoint.vals[0].toFixed(2)}
                step={0.01}
                onChange={(e) => {
                  const newPoints = [...path];
                  newPoints[index].vals[0] = parseFloat(e.target.value);
                  setPath(newPoints);
                }}
              />
              <input
                type="number"
                value={aPoint.vals[1].toFixed(2)}
                step={0.01}
                onChange={(e) => {
                  const newPoints = [...path];
                  newPoints[index].vals[1] = parseFloat(e.target.value);
                  setPath(newPoints);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
    // <>
    //   <GradientGl
    //     l={{
    //       source: 'x',
    //       min: 0.0,
    //       max: 1.0,
    //       fnType: 'pow',
    //       powVal: 1 / 2.2,
    //     }}
    //     c={{
    //       source: 'const',
    //       min: 0.0,
    //       max: 0.4,
    //       constVal: 0.0,
    //     }}
    //     h={{
    //       source: 'const',
    //       min: 0.0,
    //       max: 360.0,
    //       constVal: 0.0,
    //     }}
    //   />
    //   <GradientGl
    //     l={{
    //       source: 'x',
    //       min: 0.0,
    //       max: 1.0,
    //     }}
    //     c={{
    //       source: 'y',
    //       min: 0.0,
    //       max: 0.4,
    //     }}
    //     h={{
    //       source: 'const',
    //       min: 0.0,
    //       max: 360.0,
    //       constVal: 0.0,
    //     }}
    //   />
    //   <GradientGl
    //     l={{
    //       source: 'const',
    //       min: 0.0,
    //       max: 1.0,
    //       constVal: 0.5,
    //     }}
    //     c={{
    //       source: 'y',
    //       min: 0.0,
    //       max: 0.4,
    //     }}
    //     h={{
    //       source: 'x',
    //       min: 0.0,
    //       max: 360.0,
    //     }}
    //   />
    // </>
  );
}

export default App;
