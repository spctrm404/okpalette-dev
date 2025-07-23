import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import GradientGl from './components/GradientGl/GradientGl';
import Graph from './components/Graph/Graph';

function App() {
  // linear 테스트
  const [linear, setLinear] = useState({ a: 1, b: 0 });

  // pow 테스트
  const [pow, setPow] = useState({ a: 2 });

  // bezier 테스트
  const [bezier, setBezier] = useState({
    p0: { x: 0, y: 0 },
    c0: { x: 0.3, y: 1 },
    c1: { x: 0.7, y: 0 },
    p1: { x: 1, y: 1 },
  });

  return (
    <>
      <div>
        <h3>Linear</h3>
        <Graph type="linear" value={linear} onChange={setLinear} />
        <pre>{JSON.stringify(linear, null, 2)}</pre>
      </div>
      <div>
        <h3>Pow</h3>
        <Graph type="pow" value={pow} onChange={setPow} />
        <pre>{JSON.stringify(pow, null, 2)}</pre>
      </div>
      <div>
        <h3>Bezier</h3>
        <Graph type="bezier" value={bezier} onChange={setBezier} />
        <pre>{JSON.stringify(bezier, null, 2)}</pre>
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
