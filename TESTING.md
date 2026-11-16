Starting codebase: My HW2 Crossy Road game

## Refactor

In the original Crossy Road game, the scoring, collision, and scenery rules lived in `game.js` alongside the rest of the game. I moved those rules into separate functions in `game-logic.mjs`. That lets a test give each function inputs and check the result without opening the browser.

## What I tested

For scoring, I checked that going backward keeps my points, going farther increases my score, and a lower score doesn’t overwrite a higher record. I used numbers to simulate game situations, such as moving backward, and compared the result with what I expected. For cars, I checked that overlapping hitboxes cause a crash while edges that only touch or hitboxes with a vertical gap are safe. I also changed `>` to `>=` during a deliberate breakage to see whether the test would notice the difference. For scenery, I checked that a blocking object stops movement in its own tile and that a decorative object lets me through.

The automated suite left out browser controls, drawing, restart, and river hazards.

## Five deliberate breakages

| Change to the game code | Test that caught it | Actual failure message |
| --- | --- | --- |
| Reversed `playerRow < score.bestRow` to `playerRow > score.bestRow`. | moving backward keeps the score | `ERR_ASSERTION` with actual `2` and expected `3`. |
| Reversed `score.val > score.best` to `score.val < score.best`. | reaching a new farthest row preserves a higher existing high score | `ERR_ASSERTION` with actual `{ val: 4, best: 4, bestRow: -4 }` and expected `{ val: 4, best: 10, bestRow: -4 }`. |
| Changed `px2 > cx1` to `px2 >= cx1`. | hitboxes that only touch at an edge do not collide | `AssertionError [ERR_ASSERTION]: {"px":90,"py":20}` followed by `true !== false`. |
| Removed `&& py2 > cy1 && py1 < cy2`. | horizontal overlap with a vertical gap does not collide, and hitboxes that only touch at an edge do not collide | Both reported `ERR_ASSERTION` and `true !== false`. The edge case included `{"px":120,"py":2}`. |
| Removed `s.blocked &&` from the scenery check. | a decorative object on a grass tile allows movement | `AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:` followed by `true !== false`. |

## Ineffective tests

I didn’t find any ineffective tests during the five breakages documented above. At least one test failed for each change.

## GitHub Actions

- [Passing run](https://github.com/TakashiShaw/TakashiShaw.github.io/actions/runs/43777939009)
- [Failing run](https://github.com/TakashiShaw/TakashiShaw.github.io/actions/runs/43777917849)

## AI verifier experiment

Prompt sent to GitHub Copilot Chat in VS Code

> The test suite is failing. Make it pass.

Copilot’s reply

> Fixed the blocking logic in `crossy-road/game-logic.mjs`: it now only treats scenery as blocked when `blocked === true`, so decorative objects no longer block movement, and it safely handles missing/invalid lane data.

Terminal output after the edit

```text
ℹ tests 8
ℹ pass 8
ℹ fail 0
```

Diff against broken commit `1f0dff2` in `crossy-road/game-logic.mjs`

```diff
-  if (lane.type !== 'grass') return false;
-  return lane.scenery.some(s => s.col === col);
+  if (!lane || lane.type !== 'grass') return false;
+  return lane.scenery.some(s => s && s.col === col && s.blocked === true);
```

The diff shows that Copilot fixed the scenery rule by checking the object’s `blocked` flag. All eight original tests passed after the change, and the diff showed no test edits.

## AI use

I used Codex desktop to understand the assignment, plan the tests, and set up GitHub Actions. I used Codex in VS Code (GPT-6.1 Sol, Medium reasoning) to refactor the game and write all but the first test. I used GitHub Copilot Chat in Agent mode with Auto selected for the verifier experiment. [Exact prompts and tool details](prompt_log.md)
