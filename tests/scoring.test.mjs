import { test } from "node:test";
import assert from "node:assert/strict";
import { refreshScore } from "../crossy-road/game-logic.mjs";

test("moving backward keeps the score", () => {
  const score = { val: 3, best: 3, bestRow: -3 };

  refreshScore(score, -2, 0);

  assert.equal(score.val, 3
  );
});