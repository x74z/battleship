import Player from "./player.js";

describe("Player class", () => {
  let player;
  beforeAll(() => {
    player = new Player();
  });

  test("player creates gameboard", () => {
    expect(player.gb).toBeInstanceOf(Object);
  });
});
