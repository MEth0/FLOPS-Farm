import { useEffect, useState } from "react";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import "./App.css";
import Button from "./components/Button";
import UpgradesList from "./components/UpgradesList";
import { doTick } from "./logic/doTick";
import { Upgrades } from "./logic/Upgrades";
import { calculateAmountPerClick, formatBytes } from "./logic/utils";
import { Bonus } from "./logic/Bonus";
import BonusList from "./components/BonusList";
import { settings } from "./logic/settings";

export type GameState = {
  flops: { amount: number };
  perSec: number;
  upgrades: typeof Upgrades;
  bonus: typeof Bonus;
};

let saveTime = Date.now();

const App = () => {
  const [time, setTime] = useState(Date.now());
  const [loadedSave, setLoadedSave] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const initialState: GameState = {
    flops: { amount: 0 },
    perSec: 0,
    upgrades: Upgrades,
    bonus: Bonus,
  };

  const [state, setState] = useState(initialState);

  // Game loop, 10 ticks per second
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

  // Save the game every 2 seconds
  useEffect(() => {
    if (saveTime + 2000 < Date.now()) {
      const enc = AES.encrypt(
        JSON.stringify(state),
        settings.secret
      ).toString();
      localStorage.setItem("save", enc);
      saveTime = Date.now();
    }
  }, [state]);

  // Load saved game
  useEffect(() => {
    if (!loadedSave) {
      const save = localStorage.getItem("save");
      if (save) {
        const decrypted = AES.decrypt(save, settings.secret).toString(Utf8);
        setState(JSON.parse(decrypted));
        setLogs([...logs, "Save loaded"]);
      } else {
        setLogs([...logs, "No save found"]);
      }
      setLoadedSave(true);
    }
  }, [loadedSave, logs]);

  return (
    <>
      <div className="logs" onClick={() => setLogs([])}>
        {logs.map((log, index) => (
          <p key={index} style={{ margin: "5px" }}>
            {"?:\\> "}
            {log}
          </p>
        ))}
      </div>
      <div className="App">
        <header className="App-header">
          <div>{formatBytes(state.flops.amount, 2)}</div>
          <div className="subtitle">{state.perSec.toFixed(1)} FLOP/s</div>
          <Button
            onClick={() =>
              setState({
                ...state,
                flops: {
                  ...state.flops,
                  amount: state.flops.amount + calculateAmountPerClick(state),
                },
              })
            }
            canBuy={true}
          >
            +{calculateAmountPerClick(state)}
          </Button>
        </header>

        <div className="mainGame">
          {/* List of available upgrades */}
          <UpgradesList
            gameState={{ state, setState }}
            log={{ logs, setLogs }}
          />
          <BonusList gameState={{ state, setState }} log={{ logs, setLogs }} />
        </div>
      </div>
    </>
  );
};

export default App;
