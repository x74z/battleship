import Ship from "./ship.js";
export default class Gameboard {
  // This is a 10x10 grid. from 0 to 9.
  constructor(size = 10) {
    this.size = size;
    this.ships = [];
    this.occupiedCoords = [];
    this.hitCoordinates = [];
    this.missedCoordinates = [];
  }
  isCoordinateWithinGrid(coordinate) {
    if (coordinate[0] >= 0 && coordinate[0] <= 9) {
      if (coordinate[1] >= 0 && coordinate[1] <= 9) {
        return true;
      }
    }
    return false;
  }
  
  populateBoardForRegularGame(){
    const predeterminedCoords = {
      carrier: [[0,0], [0,1], [0,2], [0,3], [0,4]],
      battleship: [[2,0], [2,1], [2,2], [2,3]],
      cruiser: [[4,0], [4,1], [4,2]],
      destroyer: [[6,0], [6,1]],
      submarine: [[8,0]],
    }
  for (const [shipName, coords] of Object.entries(predeterminedCoords)) {
      this.placeShip(coords.length,coords);
      
    }
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
      this.ships[index].ship.hit(coord);
      this.hitCoordinates.push(coord);
      // Check if all ships have sunked after one has sunked
      // console.log(this.ships[index].ship)
      if (this.ships[index].ship.isSunked === true) this.haveAllShipsSunked();
    } else this.missedCoordinates.push(coord);
  }

  haveAllShipsSunked() {
    const allShipsSunked = this.ships.every((shipAndCoordObj) => {
      return shipAndCoordObj.ship.isSunked;
    });

    return allShipsSunked;
  }
}
