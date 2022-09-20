import { GameState } from "../App";

export type GameUpdater = {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
};

export type LogUpdater = {
  logs: string[];
  setLogs: React.Dispatch<React.SetStateAction<string[]>>;
};
