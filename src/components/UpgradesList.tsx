import { GameUpdater, LogUpdater } from "../logic/types";
import { buyUpgrade, formatBytes } from "../logic/utils";
import Button from "./Button";

interface UpgradesListProps {
  gameState: GameUpdater;
  log: LogUpdater;
}

const UpgradesList = ({ gameState, log }: UpgradesListProps) => {
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
        Upgrades
      </h2>
      {state.upgrades.map((upgrade, index) => (
        <div key={index} style={{ padding: "5px" }}>
          {upgrade.amount} ×{" "}
          <Button
            onClick={() => {
              buyUpgrade(upgrade.name, { state, setState }, log);
            }}
            title={upgrade.addPerSec.toFixed(1) + " FLOP/s"}
            canBuy={upgrade.cost <= state.flops.amount}
          >
            {upgrade.name} - {formatBytes(upgrade.cost, 2)}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default UpgradesList;
