import Observable from './Observable'; // Importing the subject

type prop = {
  observable: Observable<number>;
};

const ControlComponent = ({ observable }: prop) => {
  const incrementState = () => {
    observable.value += 1;
  };

  return (
    <div>
      <button onClick={incrementState}>Increment State</button>
    </div>
  );
};

export default ControlComponent;
