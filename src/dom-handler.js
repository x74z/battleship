export default class DomHandler {
  constructor() {
    this.cellMissClass = "battlefield__table-cell--miss";
    this.cellHitClass = "battlefield__table-cell--hit";
    this.cellOccupiedClass = "battlefield__table-cell--occupied";
  }
  colorCellsInBoard(coords, target = "player") {
    // coords is an array of arrays. [[0,0], [0,1], ...]
    const board = this.getBoardWithTarget(target);

    coords.forEach((coord) => {
      this.updateCellClassOfBoardWithCoord( this.cellOccupiedClass, coord, board);
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
    if (playerBoardObject.haveAllShipsSunked()){
      // Logic for a gameover something
    }
  }

  getBoardWithTarget(target = "player") {
    return document.querySelector(`.js-battlefield__board--${target}`);
  }
  addClickListenersToCells(playerBoardObject, target = "player") {
    const board = this.getBoardWithTarget(target);
    const cells = board.querySelectorAll(".js-battlefield__table-cell");
    cells.forEach((cell) => {
      cell.addEventListener("pointerdown", (event) => {
        playerBoardObject.receiveAttack([
          parseInt(cell.dataset.x),
          parseInt(cell.dataset.y),
        ]);
        // After running the attack, the ui must be updated
        this.updateCellsOnHitOrMiss(playerBoardObject, board);
      });
    });
  }
}
