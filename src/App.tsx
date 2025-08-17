import { Lightness } from '@/composition/Lightness';
import ObserverComponent from '@/components/Test2/ObserverComponent';
import ControlComponent from '@/components/Test2/ControlComponent';
import Observable from '@/components/Test2/Observable';
import { useRef } from 'react';
import Test3 from '@/components/Test3/Test3';

function App() {
  const observable1 = useRef(new Observable<number>(0)).current;
  const observable2 = useRef(new Observable<number>(100)).current;

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
    <Test3 />
  );
}

export default App;
