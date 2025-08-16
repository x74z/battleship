import Gameboard from "./gameboard.js";
import Ship from "./ship.js";
import Player from "./player.js";
import "./styles.css";
import GameHandler from "./game-handler.js";

(() => {
  // KNOWN ISSUES: sometimes if you interact too fast with a cell and then another one, it seems that the event listener gets removed. This happens more with ship coordinates.
  const gameHandler = new GameHandler;
  gameHandler.startSelectionScreen();
})();
