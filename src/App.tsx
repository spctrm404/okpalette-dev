import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import GradientGl from './components/GradientGl/GradientGl';
import Grapher from './components/Grapher/Grapher';
import type { Paths } from './components/Grapher/Grapher.types';

const initialPoints: [number, number][] = [
  [0, 0],
  [0.25, 0.5],
  [0.75, 0.25],
  [1, 1],
];

const initialPoints2: Paths = [
  {
    type: 'linear',
    point: [0, 0],
  },
  {
    type: 'bezier',
    point: [0.25, 0.5],
    relativeControlPoint1: [1, 0],
    relativeControlPoint2: [0, 1],
  },
  {
    type: 'pow',
    point: [0.5, 0.25],
    exponent: 2,
  },
  {
    type: 'linear',
    point: [1, 1],
  },
];

function App() {
  const [points, setPoints] = useState(initialPoints2);

  return (
    <>
      <div style={{ width: '400px', aspectRatio: '4/3' }}>
        <Grapher paths={points} onChange={setPoints} />
      </div>
      <div>
        <ul>
          {points.map((aPath, index) => (
            <li key={`point-info-${index}`}>
              Point {index + 1}: ({aPath.point[0].toFixed(2)},{' '}
              {aPath.point[1].toFixed(2)})
            </li>
          ))}
        </ul>
        <div>
          {points.map((aPath, index) => (
            <div key={`point-input-${index}`}>
              <input
                type="number"
                value={aPath.point[0].toFixed(2)}
                step={0.01}
                onChange={(e) => {
                  const newPoints = [...points];
                  newPoints[index].point[0] = parseFloat(e.target.value);
                  setPoints(newPoints);
                }}
              />
              <input
                type="number"
                value={aPath.point[1].toFixed(2)}
                step={0.01}
                onChange={(e) => {
                  const newPoints = [...points];
                  newPoints[index].point[1] = parseFloat(e.target.value);
                  setPoints(newPoints);
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
