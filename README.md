# Paper-waster

by [Sasha Iakovlev](https://github.com/aiiak/)

This is a small logical game, that can force your brain work

## What in about?

This game is browser version of a game a played with pen and paper when studied in high school.

You write all digits in numbers from 1 to 19 except 10 in a 3 row by 9 cells. Then you trying to cross off adjacent cell with equal values, or with values with sum equal 10. If there is several crossed off cell are between to cell, they are considered adjacent.
When all possible cells are crossed off (in mostly cases, you just can't find appropriate pair), all remaining values are writes down, forms new board.

Win condition is to cross off all cells.

## Do you want to try? 

Clone current repository, then install dependencies by running:

`npm install`

To start playing, run

`npm run launch`

It will launch webpack-dev-server, then go to you browser and open 

'http://localhost:8081/'