import { useEffect, useState } from "react";
import "./App.css";
import { doTick } from "./logic/doTick";

export type GameState = {
  flops: { amount: number };
  perSec: number;
  auto: { cost: number; amount: number };
};

const App = () => {
  const [time, setTime] = useState(Date.now());

  const initialState: GameState = {
    flops: { amount: 0 },
    perSec: 0,
    auto: { cost: 10, amount: 0 },
  };

  const [state, setState] = useState(initialState);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(Date.now());
    }, 100);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const delta = (100 - (Date.now() - time)) / 100;
    doTick({ state, setState }, delta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return (
    <div className="App">
      <header className="App-header">
        {Math.floor(state.flops.amount)} FLOPS
        <br />
        {state.perSec} FLOP/s
      </header>
      <button
        type="button"
        onClick={() =>
          setState({
            ...state,
            flops: { ...state.flops, amount: state.flops.amount + 1 },
          })
        }
      >
        +1
      </button>
      <button
        type="button"
        onClick={() => {
          if (state.flops.amount >= state.auto.cost) {
            setState({
              ...state,
              auto: { ...state.auto, amount: state.auto.amount + 1 },
            });
          } else {
            alert("Not enough FLOPS");
          }
        }}
      >
        Buy 1 auto ({state.auto.amount} owned)
      </button>
    </div>
  );
};

export default App;
