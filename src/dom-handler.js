import Player from "./player.js";

export default class DomHandler {
  constructor() {
    this.cellMissClass = "battlefield__table-cell--miss";
    this.cellHitClass = "battlefield__table-cell--hit";
    this.cellOccupiedClass = "battlefield__table-cell--occupied";
    this.gameOverBoardClass = "battlefield__board--over";
    this.currentTurn = "enemy"; // Also manages who starts first
    this.activeTurnClass = "battlefield__board--current-turn";
    this.inactiveTurnClass = "battlefield__board--not-current-turn";
  }
  colorShipCellsInBoard(coords, target = "player") {
    // coords is an array of arrays. [[0,0], [0,1], ...]
    const board = this.getBoardWithTarget(target);

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

  updateCellsOnHitOrMiss(playerBoardObject, board) {
    const hitCoordinates = playerBoardObject.getHitCoordinates();
    const missedCoordinates = playerBoardObject.getMissedCoordinates();
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
  switchTurn(target) {
    const playerBoard = this.getBoardWithTarget("player");
    const enemyBoard = this.getBoardWithTarget("enemy");
    const enemyBoardTitle = enemyBoard.querySelector(
      ".battlefield__board-title",
    );
    const playerBoardTitle = playerBoard.querySelector(
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
        addAndRemoveClassesToBoards(playerBoard, enemyBoard);
        break;
      case "enemy":
        this.currentTurn = "player";
        addAndRemoveClassesToBoards(enemyBoard, playerBoard);
        break;
    }
  }
  cellClickEventHandler(event, cell, board, target, playerBoardObject) {
    // Having this updated here and inside the if statement makes it work. Keep it this way
    let haveAllShipsSunked = playerBoardObject.haveAllShipsSunked();
    if (this.currentTurn === target && !haveAllShipsSunked) {
      const hitSuccesful = playerBoardObject.receiveAttack([
        // receive attack returns true if succesful, so we use it to switch turn later.
        parseInt(cell.dataset.x),
        parseInt(cell.dataset.y),
      ]);
      // After running the attack, the ui must be updated
      this.updateCellsOnHitOrMiss(playerBoardObject, board);

      haveAllShipsSunked = playerBoardObject.haveAllShipsSunked();
      if (haveAllShipsSunked) {
        // TODO: make something here to prevent further clicking?
        this.handleAllShipsSunked(board);
      }
      // The turn does not switch is a ship is hit.
      if (!hitSuccesful) this.switchTurn(target);

      cell.removeEventListener("pointerdown", this.cellClickEventHandler);
    }
  }
  addClickListenersToCells(playerBoardObject, target = "enemy") {
    const board = this.getBoardWithTarget(target);
    const cells = board.querySelectorAll(".js-battlefield__table-cell");
    cells.forEach((cell) => {
      cell.addEventListener("pointerdown", (event) =>
        this.cellClickEventHandler(
          event,
          cell,
          board,
          target,
          playerBoardObject,
        ),
      );
    });
  }
  startPlayerVSComputerGame() {
    const player = new Player();
    player.gb.populateBoardWithRandomShips();
    this.colorShipCellsInBoard(player.gb.getPlacedShipsCoordinates(), "player")
  }
}
