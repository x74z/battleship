export default class DomHandler {
  constructor() {
    this.cellMissClass = "battlefield__table-cell--miss";
    this.cellHitClass = "battlefield__table-cell--hit";
    this.cellOccupiedClass = "battlefield__table-cell--occupied";
    this.gameOverBoardClass = "battlefield__board--over";
    this.currentTurn = "player";
    this.activeTurnClass = "battlefield__board-title--current-turn";
    this.inactiveTurnClass = "battlefield__board-title--not-current-turn";
  }
  colorCellsInBoard(coords, target = "player") {
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
    switch (target) {
      case "player":
        this.currentTurn = "enemy";
        playerBoardTitle.classList.remove(this.activeTurnClass);
        playerBoardTitle.classList.add(this.inactiveTurnClass);
        enemyBoardTitle.classList.remove(this.inactiveTurnClass);
        enemyBoardTitle.classList.add(this.activeTurnClass);
        break;
      case "enemy":
        this.currentTurn = "player";
        enemyBoardTitle.classList.remove(this.activeTurnClass);
        enemyBoardTitle.classList.add(this.inactiveTurnClass);
        playerBoardTitle.classList.remove(this.inactiveTurnClass);
        playerBoardTitle.classList.add(this.activeTurnClass);
        break;
    }
  }
  addClickListenersToCells(playerBoardObject, target = "player") {
    const board = this.getBoardWithTarget(target);
    const cells = board.querySelectorAll(".js-battlefield__table-cell");
    cells.forEach((cell) => {
      const eventHandler = (event) => {
        if (this.currentTurn === target) {
          playerBoardObject.receiveAttack([
            parseInt(cell.dataset.x),
            parseInt(cell.dataset.y),
          ]);
          // After running the attack, the ui must be updated
          this.updateCellsOnHitOrMiss(playerBoardObject, board);

          if (playerBoardObject.haveAllShipsSunked()) {
            // TODO: make something here to prevent further clicking?
            this.handleAllShipsSunked(board);
          }
          // Now something to change the turn.
          this.switchTurn(target);

          cell.removeEventListener("pointerdown", eventHandler);
        }
      };

      cell.addEventListener("pointerdown", eventHandler);
    });
  }
}
