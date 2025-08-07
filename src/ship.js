export default class Ship {
  constructor(length) {
    this.length = length;
    this.numOfHits = 0;
    this.isHit = false;
    this.isSunked = false;
    this.placedCoords = []; // {coord, wasCoordHit}
    // this.hitCoords = [];
  }
  isSunk() {
    if (this.numOfHits === this.length) {
      this.isSunked = true;
      return true;
    }
  }
  hit(coord = null) {
    if (coord !== null) {
      const index = this.placedCoords.findIndex((coordObj) => {
        if (coordObj.coord[0] === coord[0] && coordObj.coord[1] === coord[1])
          return true;
        else return false;
      });
      if (index !== -1)
        this.placedCoords[index].wasCoordHit = true;
    }
    this.numOfHits += 1;
    this.isHit = true;
    this.isSunk();
  }
  areShipCoordinatesValid(coords) {
    if (coords.length !== this.length) {
      throw new Error("Number of coordinates === length.");
    }

    if (
      // Checks that every row and column has the same number.
      !coords.every((e) => e[0] === coords[0][0]) &&
      !coords.every((e) => e[1] === coords[0][1])
    ) {
      throw new Error("Ship is not in a straight line");
    }

    let lastCoord;
    coords.forEach((currentCoord) => {
      if (lastCoord === undefined) {
        lastCoord = currentCoord;
        return;
      }
      if (
        Math.abs(lastCoord[0] - currentCoord[0]) > 1 ||
        Math.abs(lastCoord[1] - currentCoord[1]) > 1
      ) {
        throw new Error("Coordinates are not valid");
      }
      // console.log(`prev: ${lastCoord}, curr: ${currentCoord}`)
      lastCoord = currentCoord;
    });
    return true;
  }

  placeAtCoords(coords) {
    // This function assumes that the given coordinates are within the 10x10 grid.
    this.areShipCoordinatesValid(coords);
    this.placedCoords = [];

    coords.forEach((e) => {
      this.placedCoords.push({ coord: e, wasCoordHit: false });
    });
  }
}
