import { GameUpdater, LogUpdater } from "../logic/types";
import { buyBonus, formatBytes } from "../logic/utils";
import Button from "./Button";

interface BonusListProps {
  gameState: GameUpdater;
  log: LogUpdater;
}

const BonusList = ({ gameState, log }: BonusListProps) => {
  const { state, setState } = gameState;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <h2
        style={{
          color: "red",
          fontStyle: "italic",
          textDecoration: "underline dashed",
        }}
      >
        Bonus
      </h2>
      {state.bonus.map((bonus, index) => (
        <div key={index} style={{ padding: "5px" }}>
          {bonus.amount} ×{" "}
          <Button
            onClick={() => {
              buyBonus(bonus.name, { state, setState }, log);
            }}
            title={bonus.description}
            canBuy={
              bonus.cost <= state.flops.amount && bonus.max > bonus.amount
            }
          >
            {bonus.name} -{" "}
            {bonus.amount < bonus.max ? formatBytes(bonus.cost, 2) : "MAX"}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default BonusList;
