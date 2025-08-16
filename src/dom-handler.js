import Player from "./player.js";

// I should really make the code easier to read, especially the start mode. Maybe move it somewhere?... Idkk
export default class DomHandler {
  constructor() {
    this.cellClasses = {
      miss: "battlefield__table-cell--miss",
      hit: "battlefield__table-cell--hit",
      occupied: "battlefield__table-cell--occupied",
    };
    this.boardClasses = {
      gameOver: "battlefield__board--over",
      activeTurn: "battlefield__board--current-turn",
      inactiveTurn: "battlefield__board--not-current-turn",
    };

    this.currentTurn = "enemy"; // Also manages who starts first
    this.chosenGamemode = "";
  }

  colorOccupiedCells(coords, target = "player", optionalBoard = undefined) {
    // coords is an array of arrays. [[0,0], [0,1], ...]
    let board = this.getBoardWithTarget(target);

    // This is used to color the ships in the place ships dialog
    if (optionalBoard !== undefined) board = optionalBoard;

    coords.forEach((coord) => {
      this.updateCellClassOfBoardWithCoord(
        this.cellClasses.occupied,
        coord,
        board,
      );
    });
  }
  updateCellClassOfBoardWithCoord(newClass, coord, board) {
    const cell = board.querySelector(
      `.js-battlefield__table-cell[data-x="${coord[0]}"][data-y="${coord[1]}"]`,
    );
    cell.classList.add(newClass);
  }

  updateCellsClassesOnHitOrMiss(boardObject, board) {
    const hitCoordinates = boardObject.getHitCoordinates();
    const missedCoordinates = boardObject.getMissedCoordinates();
    const xHitMark =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>alpha-x</title><path d="M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9Z" /></svg>';

    if (hitCoordinates.length > 0) {
      hitCoordinates.forEach((coord) => {
        const cell = board.querySelector(
          `.js-battlefield__table-cell[data-x="${coord[0]}"][data-y="${coord[1]}"]`,
        );
        this.updateCellClassOfBoardWithCoord(
          this.cellClasses.hit,
          coord,
          board,
        );
        cell.innerHTML = xHitMark;
      });
    }

    if (missedCoordinates.length > 0) {
      missedCoordinates.forEach((coord) => {
        this.updateCellClassOfBoardWithCoord(
          this.cellClasses.miss,
          coord,
          board,
        );
      });
    }
  }

  getBoardWithTarget(target = "player") {
    return document.querySelector(`.js-battlefield__board--${target}`);
  }

  handleAllShipsSunked(board) {
    //TODO: make this do something useful

    board.classList.add(this.boardClasses.gameOver);
    console.log("All ships have sunked");
  }

  switchTurnFrom(target) {
    console.log(target, "changed");
    const realPlayerBoard = this.getBoardWithTarget("player");
    const enemyBoard = this.getBoardWithTarget("enemy");
    const enemyBoardTitle = enemyBoard.querySelector(
      ".battlefield__board-title",
    );
    const playerBoardTitle = realPlayerBoard.querySelector(
      ".battlefield__board-title",
    );
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
    switch (target) {
      case "player":
        this.currentTurn = "enemy";
        changeBoardClasses(realPlayerBoard, enemyBoard);
        break;
      case "enemy":
        this.currentTurn = "player";
        changeBoardClasses(enemyBoard, realPlayerBoard);
        break;
    }
  }
  cellClickEventHandler(
    event,
    cell,
    board,
    target,
    boardObject,
    isEnemyCPU = false,
    realPlayerBoardObject = undefined,
  ) {
    // Having this updated here and inside the if statement makes it work. Keep it this way
    let haveAllShipsSunked = boardObject.haveAllShipsSunked();

    if (!this.currentTurn === target && haveAllShipsSunked) return;
    const hitSuccesful = boardObject.receiveAttack([
      parseInt(cell.dataset.x),
      parseInt(cell.dataset.y),
    ]);

    this.updateCellsClassesOnHitOrMiss(boardObject, board);

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

    this.updateCellsClassesOnHitOrMiss(realPlayerBoardObject, board);

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

  shipPlacementSelectionScreen(playerBoard) {
    const dialog = document.querySelector(
      ".js-dialog--single-player-ship-placement-dialog",
    );
    const sendButton = document.querySelector(
      ".js-submit-button-single-player-ship",
    );

    const tableBoard = document.querySelector(".js-table-reference-div");
    const form = document.querySelector(".js-single-ship-dialog");
    form.append(tableBoard);

    const randomizeBoard = () => {
      playerBoard.populateBoardWithRandomShips();
      this.colorOccupiedCells(
        playerBoard.getPlacedShipsCoordinates(),
        "player",
        tableBoard,
      );
    };
    randomizeBoard();
    dialog.show();


    const randomizeButton = document.querySelector(".js-randomize-button");
    randomizeButton.addEventListener("pointerdown", randomizeBoard);

    sendButton.addEventListener("pointerdown", () => {
      randomizeButton.removeEventListener("pointerdown", randomizeBoard);
      // Reset all cell classes to be able to reuse the same board
      const cells = tableBoard.querySelectorAll("td");
      cells.forEach((cell) => cell.classList.remove(this.cellClasses.occupied));
      return playerBoard;
    });
  }

  startPlayerVSComputerGame() {
    const player = new Player();
    const enemyCPU = new Player();
    enemyCPU.gb.populateBoardWithRandomShips();

    this.shipPlacementSelectionScreen(player.gb);

    this.colorOccupiedCells(player.gb.getPlacedShipsCoordinates(), "player");

    const ENEMY_CPU = true;
    this.addClickListenersToCells(enemyCPU.gb, "enemy", ENEMY_CPU, player.gb);
  }

  startPlayerVSPlayerGame() {
    const player = new Player();
    const enemy = new Player();

    player.gb.populateBoardWithRandomShips();
    enemy.gb.populateBoardWithRandomShips();

    this.addClickListenersToCells(player.gb, "player");
    this.addClickListenersToCells(enemy.gb, "enemy");
  }
}
