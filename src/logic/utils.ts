import { GameState } from "../App";
import { Bonus } from "./Bonus";
import { GameUpdater, LogUpdater } from "./types";
import { Upgrades } from "./Upgrades";

export const calculateNewCost = (
  upgradeName: string,
  owned: number
): number => {
  const upgrade = Upgrades.find((upgrade) => upgrade.name === upgradeName);
  if (!upgrade) {
    return 0;
  }
  const multiplier = Math.pow(1.05, owned);
  return Math.floor(upgrade.cost * multiplier);
};

export const calculateNewCostOfBonus = (
  bonusName: string,
  owned: number
): number => {
  const bonus = Bonus.find((bonus) => bonus.name === bonusName);
  if (!bonus) {
    return 0;
  }
  const multiplier = Math.pow(1.2, owned);
  return Math.floor(bonus.cost * multiplier);
};

export const buyUpgrade = (
  upgradeName: string,
  { state, setState }: GameUpdater,
  { logs, setLogs }: LogUpdater
) => {
  // get index of upgrade
  const index = Upgrades.findIndex((upgrade) => upgrade.name === upgradeName);
  if (index === -1) {
    return;
  }

  const newCost = calculateNewCost(
    upgradeName,
    state.upgrades[index].amount + 1
  );
  if (state.flops.amount < state.upgrades[index].cost) {
    setLogs([...logs, "Not enough FLOPS to buy this upgrade"]);
    return;
  }
  setState({
    ...state,
    flops: {
      ...state.flops,
      amount: state.flops.amount - state.upgrades[index].cost,
    },
    upgrades: state.upgrades.map((upgrade) =>
      upgrade.name === upgradeName
        ? { ...upgrade, amount: upgrade.amount + 1, cost: newCost }
        : upgrade
    ),
  });
};

export const buyBonus = (
  bonusName: string,
  { state, setState }: GameUpdater,
  { logs, setLogs }: LogUpdater
) => {
  // get index of bonus
  const index = Bonus.findIndex((bonus) => bonus.name === bonusName);
  if (index === -1) {
    return;
  }

  const newCost = calculateNewCostOfBonus(
    bonusName,
    state.bonus[index].amount + 1
  );
  if (state.flops.amount < state.bonus[index].cost) {
    setLogs([...logs, "Not enough FLOPS to buy this bonus"]);
    return;
  }
  if (state.bonus[index].amount >= state.bonus[index].max) {
    setLogs([...logs, "You have reached the max amount of this bonus"]);
    return;
  }
  setState({
    ...state,
    flops: {
      ...state.flops,
      amount: state.flops.amount - state.bonus[index].cost,
    },
    bonus: state.bonus.map((bonus) =>
      bonus.name === bonusName
        ? { ...bonus, amount: bonus.amount + 1, cost: newCost }
        : bonus
    ),
  });
};

// Format number to simplify
export const formatBytes = (bytes: number, decimals = 0) => {
  if (!+bytes) return "0 FLOPS";

  const k = 1000;
  const dm = bytes < 1000 ? 0 : decimals;
  const sizes = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${
    sizes[i] ? sizes[i] + "FLOPS" : "FLOPS"
  }`;
};

export const calculateAmountPerClick = (state: GameState) => {
  let amount = 1;
  state.bonus.forEach((bonus) => {
    switch (bonus.name) {
      case "Mouse Speed":
        amount += bonus.amount;
        break;
      case "Pro Clicker":
        if (bonus.amount > 0) {
          amount *= 2;
        }
        break;
      default:
        break;
    }
  });
  return amount;
};
