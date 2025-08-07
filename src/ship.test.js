import Ship from "./ship.js";

describe("ship", () => {
  let ship;
  beforeAll(() => {
    ship = new Ship(3);
  });

  test("correct length", () => {
    expect(ship.length).toBe(3);
  });

  test("gets hit", () => {
    ship.hit();
    expect(ship.numOfHits).toBe(1);
    ship.hit();
    expect(ship.numOfHits).toBe(2);
    ship.hit();
    expect(ship.numOfHits).toBe(3);
  });

  test("can be sunk", () => {
    expect(ship.isSunked).toBe(true);
  });

  test("can be placed", () => {
    ship.placeAtCoords([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(ship.placedCoords[0].coord).toEqual(
      [0, 0]
    );
    expect(ship.placedCoords[0].wasCoordHit).toEqual(
      false
    );
  });

  test("can't be placed at wrong coords", () => {
    expect(() =>
      ship.placeAtCoords([
        [12391239321, 12837912321],
        [1221, 9],
        [24, 21921],
      ]),
    ).toThrow(Error);
    expect(() =>
      ship.placeAtCoords([
        [0, 0],
        [0, 0],
        [0, 2],
      ]),
    ).toThrow(Error);
  });

  test("can't be placed in anything other than a straight line", () => {
    expect(() =>
      ship.placeAtCoords([
        [0, 0],
        [0, 1],
        [1, 1],
      ]),
    ).toThrow("Ship is not in a straight line");
    expect(() =>
      ship.placeAtCoords([
        [1, 1],
        [1, 2],
        [2, 2],
      ]),
    ).toThrow("Ship is not in a straight line");
  });

  test("hit works with coordinates", () => {

    const ship2 = new Ship(2)
    ship2.placeAtCoords([[0,0],[0,1]]);
    ship2.hit([0,0])
    expect(ship2.placedCoords[0].wasCoordHit).toBe(true)
    expect(ship2.placedCoords[0].coord).toEqual([0,0])
    expect(ship2.placedCoords[1].wasCoordHit).toBe(false)
    ship2.hit([0,1])
    expect(ship2.isSunked).toBe(true)


  })


});
