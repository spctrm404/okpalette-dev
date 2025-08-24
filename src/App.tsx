// import { Lightness } from '@/composition/Lightness';
import { Lightness } from '@/composition/Lightness2';
import ObserverComponent from '@/components/Test2/ObserverComponent';
import ControlComponent from '@/components/Test2/ControlComponent';
import Observable from '@/components/Test2/Observable';
import { useRef } from 'react';
import Test3 from '@/components/Test3/Test3';
import Test4 from '@/components/Test4/Test4';

function App() {
  return (
    // <div style={{ display: 'flex', gap: '2rem' }}>
    //   <div>
    //     <h3>Set 1</h3>
    //     <ObserverComponent observable={observable1} />
    //     <ControlComponent observable={observable1} />
    //   </div>
    //   <div>
    //     <h3>Set 2</h3>
    //     <ObserverComponent observable={observable2} />
    //     <ControlComponent observable={observable2} />
    //   </div>
    // </div>
    // <Test3 />
    // <Test4 />
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
