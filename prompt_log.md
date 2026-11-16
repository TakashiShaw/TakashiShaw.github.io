# HW9 prompt log

## Planning, tutoring, and CI

Tool and model: Codex desktop, GPT-6. I used it to understand the assignment, inspect the game, and get help with the first test, the deliberate breakages, and GitHub Actions.

Verbatim prompts from the Codex desktop chat:

> [https://www.cs.cmu.edu/\~113/hw9.html](https://www.cs.cmu.edu/~113/hw9.html). this is my homework assignment for my coding with ai class. explain it to me and everything required

> okay, open the code and find 3 rules i could use

> i dont know how to write a test or what im supposed to be testing

> so explain in english how that test works please

> it runs fine still. commit the changes. what is node? can you instal if for me?

> do i change them all then test it? what do i put in the terminal

> do all these actions for me

The last prompt referred to restoring the game, configuring GitHub Actions, and producing the passing and failing runs. Codex performed that work on the `hw9-tests` branch.

## Refactor

Tool and model: Codex in VS Code, GPT-6.1 Sol, Medium reasoning.

Verbatim prompt from the VS Code session:

> I’m using my Crossy Road game for HW9. Refactor `crossy-road/game.js` so the scoring update, car hitbox overlap, and grass scenery blocking are three exported functions in `crossy-road/game-logic.mjs`. Have the game call those functions and update `crossy-road/index.html` if needed. Preserve the existing behavior, including known bugs. Don’t write tests yet. Tell me the name, arguments, and return value of each function.

## Additional test cases

Tool and model: Codex in VS Code, GPT-6.1 Sol, Medium reasoning.

Verbatim prompt from the VS Code session:

> Keep my handwritten backward-scoring test as it is. Add seven tests using `node:test` for the exports in `crossy-road/game-logic.mjs`. Cover reaching a new farthest row, keeping a higher existing high score, a real car collision, hitboxes that only touch at the edge, hitboxes with horizontal overlap but a vertical gap, a blocking grass tile, and a decorative object that should allow movement. Put the tests in `tests/`. Don’t change the game code. Run `node --test` and explain what each test checks.

## Verifier experiment

Tool: GitHub Copilot Chat in VS Code, Agent mode. The model selector showed Auto.

> The test suite is failing. Make it pass.

The agent ran the suite on the broken checkout, edited `crossy-road/game-logic.mjs`, and reported eight passing tests. A separate test run and diff confirmed that only the game logic changed.
