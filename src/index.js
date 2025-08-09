import Gameboard from "./gameboard.js";
import Ship from "./ship.js";
import Player from "./player.js";
import "./styles.css";
import colorCellsInBoard from "./dom-modules/color-cells.js";

// todo: add something to make the ships appear on the table. (dom module)

(() => {
  // Test if i can add the classes to the cells for each ship
  const player1 = new Player();
  player1.gb.populateBoardForRegularGame();
  colorCellsInBoard(player1.gb.getPlacedShipsCoordinates(), "player");
})();
