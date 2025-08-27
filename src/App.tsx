import { FnPaths } from '@/models/FnPaths';
import { Lightness } from '@/composition/Lightness';

const lightnessPath = FnPaths.fromArray([
  [0, 0],
  [25, 25],
  [50, 50, 25, 50, 75, 50],
  [75, 25, 1 / 2.2],
  [100, 0],
]);

function App() {
  return <Lightness paths={lightnessPath} />;
}

export default App;
