import Gameboard from "./gameboard.js";
import Ship from "./ship.js";
import Player from "./player.js";
import "./styles.css";
import GameHandler from "./game-handler.js";

(() => {
  // Test if i can add the classes to the cells for each ship
  const domHandler = new GameHandler;
  // const SHOW_SHIPS = true;
  // const HIDE_SHIPS = false;
  // const MAKE_CELLS_INTERACTABLE = true;
  domHandler.startSelectionScreen();
  // domHandler.startPlayerVSComputerGame();
  // domHandler.startPlayerVSPlayerGame();
  // initBoard(domHandler, "player", SHOW_SHIPS, MAKE_CELLS_INTERACTABLE);
  // initBoard(domHandler, "enemy", HIDE_SHIPS, MAKE_CELLS_INTERACTABLE);
})();
