import "./App.css";
import { useAppDispatch, useAppSelector } from "./hooks";
import { selectCounter, increment, decrement, incrementByAmount } from "./slices/counterSlice";

function App() {
  const dispatch = useAppDispatch();
  const counter = useAppSelector(selectCounter);
  return (
    <div className="App">
      Counter: {counter}
      <button onClick={() => dispatch(increment())}>increment</button>
      <button onClick={() => dispatch(decrement())}>decrement</button>
      <button onClick={() => dispatch(incrementByAmount(10))}>inc.incrementByAmount</button>
    </div>
  );
}

export default App;
