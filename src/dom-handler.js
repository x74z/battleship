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
    const xHitMark = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>alpha-x</title><path d="M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9Z" /></svg>';

    if (hitCoordinates.length > 0) {
      hitCoordinates.forEach((coord) => {
        const cell = board.querySelector( `.js-battlefield__table-cell[data-x="${coord[0]}"][data-y="${coord[1]}"]`);
        this.updateCellClassOfBoardWithCoord( this.cellClasses.hit, coord, board);
        cell.innerHTML = xHitMark;
      });
    }

    if (missedCoordinates.length > 0) {
      missedCoordinates.forEach((coord) => {
        this.updateCellClassOfBoardWithCoord( this.cellClasses.miss, coord, board);
      });
    }
  }
  colorOccupiedCells(coords, target = "player", board) {
    // coords is an array of arrays. [[0,0], [0,1], ...]

    coords.forEach((coord) => {
      this.updateCellClassOfBoardWithCoord(
        this.cellClasses.occupied,
        coord,
        board,
      );
    });
  }
}
