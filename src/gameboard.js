import Ship from "./ship.js";
export default class Gameboard {
  // This is a 10x10 grid. from 0 to 9.
  constructor(boardSize = 10) {
    this.boardSize = boardSize;
    this.ships = []; //{ ship:ship, usedCoords: [[x,y], ...] }
    this.occupiedCoords = [];
    this.hitCoordinates = [];
    this.missedCoordinates = [];
    this.interactedCoordinates = []; // This one is used so the computer doesn't hit the same coord twice
  }
  getHitCoordinates() {
    return this.hitCoordinates;
  }

  getMissedCoordinates() {
    return this.missedCoordinates;
  }

  isCoordinateWithinGrid(coordinate) {
    if (coordinate[0] >= 0 && coordinate[0] <= this.boardSize - 1) {
      if (coordinate[1] >= 0 && coordinate[1] <= this.boardSize - 1) {
        return true;
      }
    }
    return false;
  }
  getPlacedShipsCoordinates() {
    // This function is going to be used mostly for the dom functions

    // didn't know about flatmap. It joins the arrays. It is map + flat(1)
    // let finalCoords = [];
    // this.ships.forEach((ship) => {
    //   ship.usedCoords.forEach((coords) => {
    //     finalCoords.push(coords);
    //   });
    // });
    return this.ships.flatMap((ship) => ship.usedCoords);
  }
  isCoordUsed(coord) {
    return this.interactedCoordinates.some(
      (c) => c[0] === coord[0] && c[1] === coord[1],
    );
  }
  receiveRandomHit() {
    const getRandomCoord = () => {
      let coord = [
        Math.floor(Math.random() * this.boardSize),
        Math.floor(Math.random() * this.boardSize),
      ];
      while (this.isCoordUsed(coord)) {
        coord[0] = Math.floor(Math.random() * this.boardSize);
        coord[1] = Math.floor(Math.random() * this.boardSize);
      }
      return coord;
    };
    const randomCoord = getRandomCoord();

    return this.receiveAttack(randomCoord);
  }

  populateBoardWithRandomShips() {
    const optionsSizes = {
      ship1Size: 5,
      ship2Size: 4,
      ship3Size: 3,
      ship4Size: 3,
      ship5Size: 2,
      ship6Size: 1,
    };
    // for (const shipSize of Object.values(optionsSizes)) {
    //   // Logic to place the ship
    //   let coords = [];
    //   const horizontal = Math.random() < 0.5;
    //   let chosenNumber = Math.floor(Math.random() * this.boardSize);
    //   for (let i = 0; i < shipSize; i++) {
    //     if (horizontal) {
    //       coords.push([chosenNumber, i]);
    //       continue;
    //     }
    //     coords.push([i, chosenNumber]);
    //   }
    //   this.placeShip(shipSize, coords)
    // }
    console.log(this.occupiedCoords);
    this.clearBoard();
    console.log(this.occupiedCoords);
    for (const shipSize of Object.values(optionsSizes)) {
      let placed = false;

      while (!placed) {
        const horizontal = Math.random() < 0.5;

        const startRow = horizontal
          ? Math.floor(Math.random() * this.boardSize)
          : Math.floor(Math.random() * (this.boardSize - shipSize + 1));

        const startCol = horizontal
          ? Math.floor(Math.random() * (this.boardSize - shipSize + 1))
          : Math.floor(Math.random() * this.boardSize);

        const coords = [];
        for (let i = 0; i < shipSize; i++) {
          const row = horizontal ? startRow : startRow + i;
          const col = horizontal ? startCol + i : startCol;
          coords.push([row, col]);
        }

        // Check overlap using occupiedCoords
        const overlap = coords.some(([row, col]) =>
          this.occupiedCoords.some(([r, c]) => r === row && c === col),
        );

        if (!overlap) {
          this.placeShip(shipSize, coords);
          placed = true;
        }
      }
    }
  }
  populateBoardForRegularGame() {
    const predeterminedCoords = {
      // carrier: [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], ], battleship: [ [2, 0], [2, 1], [2, 2], [2, 3], ], cruiser: [ [4, 0], [4, 1], [4, 2], ],
      destroyer: [
        [6, 0],
        [6, 1],
      ],
      submarine: [[8, 0]],
    };
    for (const [shipName, coords] of Object.entries(predeterminedCoords)) {
      this.placeShip(coords.length, coords);
    }
  }

  clearBoard() {
    this.ships = [];
    this.occupiedCoords = [];
    this.hitCoordinates = [];
    this.missedCoordinates = [];
    this.interactedCoordinates = [];
  }

  placeShip(shipLength, coords) {
    if (!coords.every((e) => this.isCoordinateWithinGrid(e)))
      throw new Error("Coordinates are not within the grid");
    if (shipLength !== coords.length)
      throw new Error("Ship length must be equal to coords length");

    const ship = new Ship(shipLength);

    this.ships.push({ ship, usedCoords: coords });
    coords.forEach((e) => this.occupiedCoords.push(e));
    ship.placeAtCoords(coords);
  }
  receiveAttack(coord) {
    // Also handles missses
    if (!this.isCoordinateWithinGrid(coord))
      throw new Error("Coordinates are not within the grid");

    const index = this.ships.findIndex((shipAndCoordObj) => {
      return shipAndCoordObj.usedCoords.some((c) => {
        if (c[0] === coord[0] && c[1] === coord[1]) {
          return true;
        } else return false;
      });
    });

    if (index !== -1) {
      this.interactedCoordinates.push(coord);
      this.ships[index].ship.hit(coord);
      this.hitCoordinates.push(coord);
      // Check if all ships have sunked after one has sunked
      if (this.ships[index].ship.isSunked === true) this.haveAllShipsSunked();
      return true;
    } else {
      this.interactedCoordinates.push(coord);
      this.missedCoordinates.push(coord);
      return false;
    }
  }

  haveAllShipsSunked() {
    const allShipsSunked = this.ships.every((shipAndCoordObj) => {
      return shipAndCoordObj.ship.isSunked;
    });

    return allShipsSunked;
  }
}
