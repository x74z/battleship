export default class Ship {
  constructor(length) {
    this.length = length;
    this.numOfHits = 0;
    this.isHit = false;
    this.isSunked = false;
    this.placedCoords = [];
  }
  isSunk() {
    if (this.numOfHits === this.length) {
      this.isSunked = true;
      return true;
    }
  }
  hit() {
    this.numOfHits += 1;
    this.isSunk();
  }
  validateGivenCoords(coords) {
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
        console.log("once");
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
    this.validateGivenCoords(coords);
    this.placedCoords = [];

    coords.forEach((e) => {
      this.placedCoords.push(e);
    });
  }
}
