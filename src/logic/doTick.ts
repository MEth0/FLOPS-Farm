import { GameState } from "../App";

type GameUpdater = {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
};

export const doTick = ({ state, setState }: GameUpdater, delta: number) => {
  delta = Math.round(delta * 10) / 10;

  const calculatePerSec = () => {
    const perSec = state.auto.amount;
    return perSec;
  };

  const perSec = calculatePerSec();
  const perTick = perSec / 10;

  setState({
    ...state,
    flops: { ...state.flops, amount: state.flops.amount + perTick * delta },
    perSec,
  });
};
