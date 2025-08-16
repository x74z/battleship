import DomHandler from "./dom-handler.js";
import Player from "./player.js";

// I should really make the code easier to read, especially the start mode. Maybe move it somewhere?... Idkk
export default class GameHandler {
  constructor() {
    this.domHandler = new DomHandler();

    this.currentTurn = "enemy"; // Also manages who starts first
    this.chosenGamemode = "";
  }

  getBoardWithTarget(target = "player") {
    return document.querySelector(`.js-battlefield__board--${target}`);
  }

  handleAllShipsSunked(board) {
    //TODO: make this do something useful

    this.domHandler.gameOverBoardClass(board);
    console.log("All ships have sunked");
  }

  switchTurnFrom(target) {
    console.log(target, "<<- changed to the opposite");
    const player1 = this.getBoardWithTarget("player");
    const enemyBoard = this.getBoardWithTarget("enemy");

    const changeBoardClasses = (current, next) => {
      current.classList.replace(
        this.boardClasses.activeTurn,
        this.boardClasses.inactiveTurn,
      );
      next.classList.replace(
        this.boardClasses.inactiveTurn,
        this.boardClasses.activeTurn,
      );
    };

    if (target === "enemy") {
      this.currentTurn = "player";
      this.domHandler.changeBoardClasses(enemyBoard, player1);
    } else {
      this.currentTurn = "enemy";
      this.domHandler.changeBoardClasses(player1, enemyBoard);
    }
    // console.log(this.currentTurn);
  }

  cellClickEventHandler(
    e,
    cell,
    board,
    target,
    boardObject,
    isEnemyCPU = false,
    realPlayerBoardObject = undefined,
  ) {
    // Having this updated here and inside the if statement makes it work. Keep it this way
    let haveAllShipsSunked = boardObject.haveAllShipsSunked();

    if (haveAllShipsSunked) return;
    console.log(this.currentTurn, target);
    if (this.currentTurn !== target) return;

    const hitSuccesful = boardObject.receiveAttack([
      parseInt(cell.dataset.x),
      parseInt(cell.dataset.y),
    ]);

    this.domHandler.updateCellsClassesOnHitOrMiss(boardObject, board);

    haveAllShipsSunked = boardObject.haveAllShipsSunked();
    if (haveAllShipsSunked) {
      // TODO: make something here to prevent further clicking?
      this.handleAllShipsSunked(board);
    }

    if (!hitSuccesful) {
      this.switchTurnFrom(target);

      if (isEnemyCPU) {
        const cpuBoard = boardObject; // If in cpu mode, the player board will actually be the cpu
        this.handleCPUTurn(
          this.getBoardWithTarget("player"),
          cpuBoard,
          realPlayerBoardObject,
        );
      }
    }
    cell.removeEventListener("pointerdown", this.cellClickEventHandler);
  }

  addClickListenersToCells(
    boardObject,
    target = "enemy",
    isEnemyCPU = false,
    realPlayerBoardObject = undefined, // This is for the cpu to use.
  ) {
    const board = this.getBoardWithTarget(target);

    const cells = board.querySelectorAll(".js-battlefield__table-cell");
    cells.forEach((cell) => {
      const clickHandler = (e) => {
        this.cellClickEventHandler(
          e,
          cell,
          board,
          target,
          boardObject,
          isEnemyCPU,
          realPlayerBoardObject,
        );
      };
      cell.addEventListener("pointerdown", clickHandler, { once: true });
    });
  }
  handleCPUTurn(board, cpuBoardObj, realPlayerBoardObject) {
    let haveAllShipsSunked = realPlayerBoardObject.haveAllShipsSunked();
    if (haveAllShipsSunked) return;

    const hitSuccesful = realPlayerBoardObject.receiveRandomHit();

    this.domHandler.updateCellsClassesOnHitOrMiss(realPlayerBoardObject, board);

    haveAllShipsSunked = realPlayerBoardObject.haveAllShipsSunked();
    if (haveAllShipsSunked) this.handleAllShipsSunked(board);

    console.log(hitSuccesful);
    if (!hitSuccesful) {
      this.switchTurnFrom("player");
      return;
    } else if (hitSuccesful) {
      // By calling itself, it gets another turn, if it hits a ship.
      this.handleCPUTurn(board, cpuBoardObj, realPlayerBoardObject);
    }
  }

  startSelectionScreen() {
    const dialog = document.querySelector(".js-dialog--game-selection-screen");
    dialog.show();

    const dialogForm = dialog.querySelector("form");
    dialogForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.chosenGamemode = dialogForm.gamemode.value;

      this.chosenGamemode === "pVp"
        ? this.startPlayerVSPlayerGame()
        : this.startPlayerVSComputerGame();
      dialog.close();
    });
  }

  shipPlacementSelectionScreen(
    playerBoard,
    { twoPlayerMode = false, enemyBoard = undefined } = {},
  ) {
    const dialog = twoPlayerMode
      ? document.querySelector(
        ".js-dialog--single-player-ship-placement-dialog",
      )
      : document.querySelector(
        ".js-dialog--second-player-ship-placement-dialog",
      );

    const sendButton = twoPlayerMode
      ? document.querySelector(".js-submit-button-single-player-ship")
      : document.querySelector(".js-submit-button-second-player-ship");

    const originalBoard = document.querySelector(".js-table-reference-div");
    const board = originalBoard.cloneNode(true);
    const form = twoPlayerMode
      ? document.querySelector(".js-single-ship-dialog")
      : document.querySelector(".js-second-ship-dialog");
    form.append(board);

    const randomizeBoard = () => {
      playerBoard.populateBoardWithRandomShips();
      this.domHandler.colorOccupiedCells(
        playerBoard.getPlacedShipsCoordinates(),
        "player",
        board,
      );
    };
    randomizeBoard();
    dialog.show();

    const randomizeButton = document.querySelector(".js-randomize-button");
    randomizeButton.addEventListener("pointerdown", randomizeBoard);

    sendButton.addEventListener("pointerdown", () => {
      randomizeButton.removeEventListener("pointerdown", randomizeBoard);
      // Reset all cell classes to be able to reuse the same board
      const cells = board.querySelectorAll("td");
      cells.forEach((cell) => this.domHandler.removeBoardCellClasses(board));

      dialog.close();
      // If it's two players, show another dialog.
      if (twoPlayerMode) {
        this.shipPlacementSelectionScreen(enemyBoard, { twoPlayerMode: false });
      }
      return playerBoard;
    });
  }

  startPlayerVSComputerGame() {
    const player = new Player();
    const enemyCPU = new Player();
    enemyCPU.gb.populateBoardWithRandomShips();

    this.shipPlacementSelectionScreen(player.gb);

    this.domHandler.colorOccupiedCells(
      player.gb.getPlacedShipsCoordinates(),
      "player",
      this.getBoardWithTarget("player"),
    );

    const ENEMY_CPU = true;
    this.addClickListenersToCells(enemyCPU.gb, "enemy", ENEMY_CPU, player.gb);
  }

  startPlayerVSPlayerGame() {
    const player = new Player();
    const enemy = new Player();

    player.gb.populateBoardWithRandomShips();
    enemy.gb.populateBoardWithRandomShips();

    const TWO_PLAYER_MODE = true;
    this.shipPlacementSelectionScreen(player.gb, {
      twoPlayerMode: TWO_PLAYER_MODE,
      enemyBoard: enemy.gb,
    });

    this.addClickListenersToCells(player.gb, "player");
    this.addClickListenersToCells(enemy.gb, "enemy");
  }
}
