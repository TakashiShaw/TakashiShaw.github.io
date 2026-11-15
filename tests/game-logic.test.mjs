import { test } from "node:test";
import assert from "node:assert/strict";
import {
  refreshScore,
  overlapsCar,
  isTileBlocked,
} from "../crossy-road/game-logic.mjs";

test("reaching a new farthest row updates the score and high score", () => {
  const score = { val: 3, best: 3, bestRow: 2 };

  refreshScore(score, 1, 5);

  assert.deepEqual(score, { val: 4, best: 4, bestRow: 1 });
});

test("reaching a new farthest row preserves a higher existing high score", () => {
  const score = { val: 3, best: 10, bestRow: -3 };

  refreshScore(score, -4, 0);

  assert.deepEqual(score, { val: 4, best: 10, bestRow: -4 });
});

const config = { tileSize: 40, playerHitbox: 0.5, carHitbox: 0.8 };
const car = { x: 100, w: 40, h: 20 };
// At laneY = 0, the car hitbox spans x = 100..140 and y = 12..28.
// The player hitbox extends 10 pixels from its center in each direction.

test("a player hitbox overlapping a car on both axes collides", () => {
  assert.equal(overlapsCar({ px: 105, py: 20 }, car, 0, config), true);
});

test("hitboxes that only touch at an edge do not collide", () => {
  for (const player of [
    { px: 90, py: 20 }, // Player right edge touches car left edge.
    { px: 150, py: 20 }, // Player left edge touches car right edge.
    { px: 120, py: 2 }, // Player bottom edge touches car top edge.
    { px: 120, py: 38 }, // Player top edge touches car bottom edge.
  ]) {
    assert.equal(overlapsCar(player, car, 0, config), false, JSON.stringify(player));
  }
});

test("horizontal overlap with a vertical gap does not collide", () => {
  // Player bottom is y = 10, leaving a 2-pixel gap above the car hitbox.
  assert.equal(overlapsCar({ px: 120, py: 0 }, car, 0, config), false);
});

test("blocking scenery on a grass tile prevents movement", () => {
  const lane = { type: "grass", scenery: [{ col: 3, blocked: true }] };

  assert.equal(isTileBlocked(lane, 3), true);
  assert.equal(isTileBlocked(lane, 4), false);
});

test("a decorative object on a grass tile allows movement", () => {
  const lane = { type: "grass", scenery: [{ col: 3, blocked: false }] };

  assert.equal(isTileBlocked(lane, 3), false);
});
