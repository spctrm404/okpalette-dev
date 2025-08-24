import { Lightness } from '@/composition/Lightness';

function App() {
  return (
    <Lightness
      pathsArray={[
        [0, 0],
        [25, 25],
        [50, 50, 25, 50, 75, 50],
        [75, 25, 1 / 2.2],
        [100, 0],
      ]}
    />
  );
}

export default App;
