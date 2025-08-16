import Player from "./player.js";

// I should really make the code easier to read, especially the start mode. Maybe move it somewhere?... Idkk
export default class DomHandler {
  constructor() {
    this.cellMissClass = "battlefield__table-cell--miss";
    this.cellHitClass = "battlefield__table-cell--hit";
    this.cellOccupiedClass = "battlefield__table-cell--occupied";
    this.gameOverBoardClass = "battlefield__board--over";
    this.currentTurn = "enemy"; // Also manages who starts first
    this.activeTurnClass = "battlefield__board--current-turn";
    this.inactiveTurnClass = "battlefield__board--not-current-turn";
    this.chosenGamemode = "";
  }

  colorShipCellsInBoard(coords, target = "player", optionalBoard = undefined) {
    // coords is an array of arrays. [[0,0], [0,1], ...]
    let board = this.getBoardWithTarget(target);
    // This is used to color the ships in the place ships dialog
    if (optionalBoard !== undefined) board = optionalBoard;

    coords.forEach((coord) => {
      this.updateCellClassOfBoardWithCoord(
        this.cellOccupiedClass,
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

  updateCellsOnHitOrMiss(boardObject, board) {
    const hitCoordinates = boardObject.getHitCoordinates();
    const missedCoordinates = boardObject.getMissedCoordinates();
    const xHitMark =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>alpha-x</title><path d="M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9Z" /></svg>';

    if (hitCoordinates.length > 0) {
      hitCoordinates.forEach((coord) => {
        const cell = board.querySelector(
          `.js-battlefield__table-cell[data-x="${coord[0]}"][data-y="${coord[1]}"]`,
        );
        this.updateCellClassOfBoardWithCoord(this.cellHitClass, coord, board);
        cell.innerHTML = xHitMark;
      });
    }

    if (missedCoordinates.length > 0) {
      missedCoordinates.forEach((coord) => {
        this.updateCellClassOfBoardWithCoord(this.cellMissClass, coord, board);
      });
    }
  }

  getBoardWithTarget(target = "player") {
    return document.querySelector(`.js-battlefield__board--${target}`);
  }

  handleAllShipsSunked(board) {
    //TODO: make this do something useful

    board.classList.add(this.gameOverBoardClass);
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
    const addAndRemoveClassesToBoards = (current, next) => {
      current.classList.remove(this.activeTurnClass);
      current.classList.add(this.inactiveTurnClass);
      next.classList.remove(this.inactiveTurnClass);
      next.classList.add(this.activeTurnClass);
    };
    switch (target) {
      case "player":
        this.currentTurn = "enemy";
        addAndRemoveClassesToBoards(realPlayerBoard, enemyBoard);
        break;
      case "enemy":
        this.currentTurn = "player";
        addAndRemoveClassesToBoards(enemyBoard, realPlayerBoard);
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
    if (
      this.currentTurn === target &&
      !haveAllShipsSunked
      // && !boardObject.isCoordUsed([cell.dataset.x, cell.dataset.y])
    ) {
      const hitSuccesful = boardObject.receiveAttack([
        // receive attack returns true if succesful, so we use it to switch turn later.
        parseInt(cell.dataset.x),
        parseInt(cell.dataset.y),
      ]);
      // After running the attack, the ui must be updated
      this.updateCellsOnHitOrMiss(boardObject, board);

      haveAllShipsSunked = boardObject.haveAllShipsSunked();
      if (haveAllShipsSunked) {
        // TODO: make something here to prevent further clicking?
        this.handleAllShipsSunked(board);
      }
      // The turn does not switch is a ship is hit.
      if (!hitSuccesful) {
        this.switchTurnFrom(target);

        if (isEnemyCPU) {
          // Handle the cpu move if needed
          const realPlayerBoard = this.getBoardWithTarget("player");
          // const realPlayerCells = realPlayerBoard.querySelectorAll( ".js-battlefield__table-cell");
          const cpuBoard = boardObject; // If in cpu mode, the player board will actually be the cpu
          this.handleCPUTurn(realPlayerBoard, cpuBoard, realPlayerBoardObject);
        }
      }
      cell.removeEventListener("pointerdown", this.cellClickEventHandler);
    }
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
      cell.addEventListener(
        "pointerdown",
        (event) => {
          this.cellClickEventHandler(
            event,
            cell,
            board,
            target,
            boardObject,
            isEnemyCPU,
            realPlayerBoardObject,
          );
        },
        { once: true },
      );
    });
  }
  handleCPUTurn(board, cpuBoardObj, realPlayerBoardObject) {
    let haveAllShipsSunked = realPlayerBoardObject.haveAllShipsSunked();
    if (!haveAllShipsSunked) {
      const hitSuccesful = realPlayerBoardObject.receiveRandomHit();
      // After running the attack, the ui must be updated
      this.updateCellsOnHitOrMiss(realPlayerBoardObject, board);

      haveAllShipsSunked = realPlayerBoardObject.haveAllShipsSunked();
      if (haveAllShipsSunked) {
        // TODO: make something here to prevent further clicking?
        this.handleAllShipsSunked(board);
      }
      // The turn does not switch is a ship is hit.
      console.log(hitSuccesful);
      if (!hitSuccesful) {
        this.switchTurnFrom("player");
        return;
      } else if (hitSuccesful) {
        // By calling itself, it gets another turn, if it hits a ship.
        this.handleCPUTurn(board, cpuBoardObj, realPlayerBoardObject);
      }
    }
  }

  startSelectionScreen() {
    const dialog = document.querySelector(".js-dialog--game-selection-screen");
    dialog.show();
    const dialogForm = dialog.querySelector("form");
    dialogForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const chosenGamemode = dialogForm.gamemode.value;
      if (chosenGamemode === "pVp") {
        this.startPlayerVSPlayerGame();
      } else {
        this.startPlayerVSComputerGame();
      }
      this.chosenGamemode = chosenGamemode;
      dialog.close();
    });
  }

  singlePlayerShipPlacementSelectionScreen(playerBoard) {
    const dialog = document.querySelector(
      ".js-dialog--single-player-ship-placement-dialog",
    );
    const sendButton = document.querySelector(
      ".js-submit-button-single-player-ship",
    );

    const tableBoard = document.querySelector(".js-table-reference-div");
    const form = document.querySelector(".js-single-ship-dialog");
    form.append(tableBoard);
    dialog.show();

    const randomizeBoard = () => {
      playerBoard.populateBoardWithRandomShips();
      this.colorShipCellsInBoard(
        playerBoard.getPlacedShipsCoordinates(),
        "player",
        tableBoard,
      );
    };
    const randomizeButton = document.querySelector(".js-randomize-button");
    randomizeButton.addEventListener("pointerdown", randomizeBoard);
    sendButton.addEventListener("pointerdown", () => {
      randomizeButton.removeEventListener("pointerdown", randomizeBoard);
      // Reset all cell classes to be able to reuse the same board
      const cells = tableBoard.querySelectorAll("td");
      cells.forEach((cell) => cell.classList.remove(this.cellOccupiedClass));
      return playerBoard;
    });
  }

  startPlayerVSComputerGame() {
    const player = new Player();
    const enemyCPU = new Player();
    enemyCPU.gb.populateBoardWithRandomShips();

    this.singlePlayerShipPlacementSelectionScreen(player.gb);

    // The ships placement will be colored here
    this.colorShipCellsInBoard(player.gb.getPlacedShipsCoordinates(), "player");

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
