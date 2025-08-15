import { Lightness } from './composition/Lightness';

function App() {
  return (
    <>
      <div style={{ width: '50%', height: '800px' }}>
        <Lightness
          pathsArray={[
            [0, 0],
            [25, 0.5, 12.5, 0.5, 37.5, 0.5],
            [50, 0.25, 37.5, 0.25, 50, 0.25],
            [75, 0.5, 1 / 2.2],
            [100, 1],
          ]}
        />
      </div>
    </>
  );
}

export default App;
