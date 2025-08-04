import Ship from "./ship";

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
});
