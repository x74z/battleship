export default class DomHandler {
  colorCellsInBoard(coords, target = "player") {
    // coords is an array of arrays. [[0,0], [0,1], ...]
    const board = document.querySelector(`.js-battlefield__board--${target}`);

    coords.forEach((coord) => {
      const cell = board.querySelector(
        `.js-battlefield__table-cell[data-x="${coord[0]}"][data-y="${coord[1]}"]`,
      );
      cell.classList.add("battlefield__table-cell--occupied");
    });
  }
}
