# The Rooftop Reservoir — level blueprint

Week 4 • Sarthak Shelar • 03/11/2026

## Intent

Turn three isolated Echo puzzles into one connected rooftop restoration journey. Teach, extend and combine the existing recording mechanic without adding enemies or timing pressure. The player restores pump A, then pump B, then the final reservoir. Pumps permanently open their upstream gates and create session checkpoints.

## Spatial specification

21 columns × 11 rows, including boundary walls. Coordinates below are zero-based `(x,y)` matching `core.js`. `level4.json` is an exported design snapshot of the implemented level, not a second runtime map. `LEVEL_MAP.png` is a coordinate map of that exact snapshot.

| Item | Coordinate | Behavior |
| --- | --- | --- |
| Pip start | (2,8) | Spawn; full-level restart returns here |
| Sun plate 1 | (4,6) | Holds gate 1 open while occupied |
| Gate 1 | (7,7) | First bottleneck; latched after pump A |
| Pump A | (9,8) | Activates with Enter; first checkpoint |
| Sun plate 2 | (11,3) | Operates after A; holds gate 2 open |
| Gate 2 | (13,4) | Second bottleneck; latched after pump B |
| Pump B | (15,5) | Activates with Enter after A; second checkpoint |
| Sun plate 3 | (15,2) | Operates after B; holds gate 3 open |
| Gate 3 | (17,3) | Final bottleneck; not permanently latched |
| Final terminal | (19,2) | Completes level only after A and B |
| Story signs | (2,6), (10,7), (16,4) | Optional Enter interaction; no turn cost |

Stone dividers at x=7, 13 and 17 extend between boundary walls, each with one gate opening. Interior wall clusters add shape to the areas without blocking the verified routes. Decorative planters at (1,8), (9,2), and (18,7) are nonblocking floor details outside the solution route. Story sign tiles are also walkable. Solid obstacles are the wall tiles and closed gates.

## Stage 1 — intake yard

Goal: reach pump A. Start and plate 1 are near each other so the player can infer the split-route idea. The pump is visible beyond the first divider.

From the start, press E, then Right ×2 and Up ×2. Press E again to rewind. The Echo ends on plate 1 after four commands.

Replay: Right ×4, Up, Right ×2, Down, Right. Press Enter at pump A. This takes nine replay turns. Gate 1 is already open before entry on turn 6. Pump A latches gate 1 and removes the old Echo.

## Stage 2 — pump terrace

Goal: reach pump B. The plate is farther from checkpoint A, using seven of the eight available recording slots. Separate upper and lower paths make the player reconsider the room layout.

At pump A, press E, then Right ×2 and Up ×5. Press E to rewind.

Replay: Up ×4, Right ×6, Down. Press Enter at pump B. This takes eleven additional replay turns. Gate 2 is entered on replay turn 8, after the Echo reaches plate 2 on turn 7. Pump B latches gate 2 and creates the second checkpoint.

## Stage 3 — reservoir approach

Goal: activate the reservoir. A shorter recording consolidates the rule after the longer middle stage, giving the ending a readable finish.

At pump B, press E, then Up ×3. Press E to rewind.

Replay: Right, Up ×2, Right ×3, Up. Press Enter at the final terminal. This takes seven additional replay turns; gate 3 is entered on turn 4 after the Echo reaches its plate on turn 3.

Total documented route: 27 replay turns; recordings use 4, 7 and 3 commands. At zero resets the score is 730. Recording moves are not counted as replay turns. The route is verified, not claimed globally shortest.

## Environmental storytelling

The entry sign explains the dry intake and first sun switch. The middle sign connects pump A to the terrace supply. The final sign describes the reservoir as the source for the planters. Pump A changes the western and middle floor areas to restored tiles; pump B extends that visual change to the reservoir approach. The final terminal changes all floor tiles and the last planter state. This is a stylized restoration effect; no fluid simulation is implemented.

## Failure and recovery

R resets the current attempt to the latest pump checkpoint, preserving its restored pumps and baseline replay turns. A failed recording before pump A returns to the starting area. The separate Restart whole level button clears all pumps, checkpoints, turns and reset penalties. Checkpoints exist only in the current page session; refreshing starts the level again. Completed-room scores can persist through local storage.

## Balance evidence and remaining playtest

Automated walkthroughs validate stage lengths, recording limits, gate order, completion requirements and checkpoint recovery. Reachability checks confirm each closed gate separates its intended objective from the prior checkpoint. These establish solvability and bottlenecks, not perceived challenge.

Human playtest plan: ask 3–5 players to complete the level without the exact solution initially. Record time per stage, resets, hint use, missed pump interactions and whether players understand checkpoint scope. Targets: no unrecoverable states, players understand stage 1 within two attempts, and the seven-command middle recording is discoverable with the gentle hint. These are future criteria, not measured results. If stage 2 causes repeated confusion, add a clearer sign or shorten the path; if it is trivial, refine obstacles without extending recordings beyond eight commands.
