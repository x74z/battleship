import Gameboard from "./gameboard.js";
import Ship from "./ship.js";
import Player from "./player.js";
import "./styles.css";
import DomHandler from "./dom-handler.js";

function initBoard(
  domHandler,
  target = "player",
  showShipCells = false,
  makeShipsInteractable = false,
) {
  // These functions are just for testing, clean this up later
  const playerClass = new Player();
  playerClass.gb.populateBoardForRegularGame();
  if (showShipCells) {
    domHandler.colorShipCellsInBoard(
      playerClass.gb.getPlacedShipsCoordinates(),
      target,
    );
  }
  if (makeShipsInteractable)
    domHandler.addClickListenersToCells(playerClass.gb, target);
}
(() => {
  // Test if i can add the classes to the cells for each ship
  const domHandler = new DomHandler();
  const SHOW_SHIPS = true;
  const HIDE_SHIPS = false;
  const MAKE_CELLS_INTERACTABLE = true;
  domHandler.startPlayerVSComputerGame();
  // domHandler.startPlayerVSPlayerGame();
  // initBoard(domHandler, "player", SHOW_SHIPS, MAKE_CELLS_INTERACTABLE);
  // initBoard(domHandler, "enemy", HIDE_SHIPS, MAKE_CELLS_INTERACTABLE);
})();
