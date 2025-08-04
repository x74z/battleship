export default class Ship {
  constructor(length) {
    this.length = length;
    this.numOfHits = 0;
    this.isHit = false;
    this.isSunked = false;
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
}
