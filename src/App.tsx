import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import GradientGl from './components/GradientGl/GradientGl';
import Grapher from './components/Grapher/Grapher';

const initialPoints: [number, number][] = [
  [0, 0],
  [0.25, 0.5],
  [0.75, 0.25],
  [1, 1],
];

function App() {
  const [points, setPoints] = useState(initialPoints);

  return (
    <>
      <div style={{ width: '75%', aspectRatio: '16/9' }}>
        <Grapher
          path={points}
          range2d={[
            [-1, -1],
            [2, 2],
          ]}
          thumbSize={16}
          onChange={setPoints}
        />
      </div>
      <div>
        <ul>
          {points.map((point, index) => (
            <li key={`point-info-${index}`}>
              Point {index + 1}: ({point[0].toFixed(2)}, {point[1].toFixed(2)})
            </li>
          ))}
        </ul>
        <div>
          {points.map((point, index) => (
            <div key={`point-input-${index}`}>
              <input
                type="number"
                value={point[0].toFixed(2)}
                step={0.01}
                onChange={(e) => {
                  const newPoints = [...points];
                  newPoints[index][0] = parseFloat(e.target.value);
                  setPoints(newPoints);
                }}
              />
              <input
                type="number"
                value={point[1].toFixed(2)}
                step={0.01}
                onChange={(e) => {
                  const newPoints = [...points];
                  newPoints[index][1] = parseFloat(e.target.value);
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
