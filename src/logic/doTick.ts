import { GameUpdater } from "./types";
import { Upgrades } from "./Upgrades";

export const doTick = ({ state, setState }: GameUpdater, delta: number) => {
  delta = Math.round(delta * 10) / 10;

  const calculatePerSec = () => {
    let perSec = 0;
    state.upgrades.forEach((upgrade, i) => {
      perSec += upgrade.amount * Upgrades[i].addPerSec;
    });
    return perSec;
  };

  const perSec = calculatePerSec();
  const perTick = perSec / 10;

  setState({
    ...state,
    flops: {
      ...state.flops,
      amount: state.flops.amount + perTick * delta,
    },
    perSec,
  });
};
