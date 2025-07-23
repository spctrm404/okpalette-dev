import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import GradientGl from './components/GradientGl/GradientGl';
import { Grapher } from './components/Grapher/Grapher';

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
      <Grapher
        points={points}
        range={{ min: [-1, -2], max: [1, 2] }}
        width={400}
        height={300}
        thumbSize={40}
        onChange={setPoints}
      />
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
