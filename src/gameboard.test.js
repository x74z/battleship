import Gameboard from "./gameboard.js";

describe("Gameboard", () => {
  let gb;
  beforeAll(() => {
    gb = new Gameboard();
  });

  test("coordinate valid method", () => {
    expect(gb.isCoordinateWithinGrid([10, 10])).toBe(false); // Goes from 0 to 9, so 10x10
    expect(gb.isCoordinateWithinGrid([9, 10])).toBe(false);
    expect(gb.isCoordinateWithinGrid([-9, 10])).toBe(false);
    expect(gb.isCoordinateWithinGrid([0, 0])).toBe(true);
    expect(gb.isCoordinateWithinGrid([8, 2])).toBe(true);
    expect(gb.isCoordinateWithinGrid([1, 1])).toBe(true);
  });

  test("placeShip method", () => {
    expect(() => gb.placeShip(3,[[0, 0], [0, 1], [1, 999]])).toThrow("Coordinates are not within the grid");
    expect(() => gb.placeShip(5,[[0, 0], [0, 1], [1, 1]])).toThrow("Ship length must be equal to coords length");

    gb.placeShip(3, [[0, 0], [0, 1], [0, 2]])
    expect(gb.ships.length).toBe(1)
    expect(gb.ships[0].usedCoords).toEqual([[0, 0], [0, 1], [0, 2]])

  });

  test("receiveAttack method", () => {
    expect(() => gb.receiveAttack([-1,-4])).toThrow();
    expect(() => gb.receiveAttack([0,98])).toThrow();

    gb.receiveAttack([0,0]);
    gb.receiveAttack([8,8]);
    // console.log(gb.ships[0].ship)
    // console.log(gb.ships[0].usedCoords)
    expect(gb.hitCoordinates.length).toBe(1)
    expect(gb.hitCoordinates[0]).toEqual([0,0])
    expect(gb.ships[0].ship.isHit).toBe(true)
    expect(gb.ships[0].ship.numOfHits).toBe(1)
    expect(gb.missedCoordinates.length).toBe(1)
    // Sunk the ship
    gb.receiveAttack([0,1]);
    gb.receiveAttack([0,2]);
    expect(gb.hitCoordinates.length).toBe(3)
    expect(gb.ships[0].ship.numOfHits).toBe(3)
  });

  test("haveAllShipsSunked method", () =>{
    // console.log(gb.ships[0].ship)
   expect(gb.haveAllShipsSunked()).toBe(true) 
  })
});
