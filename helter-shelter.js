// Helter Shelter

// file:///home/pi/Proj/24a2/helter-shelter/index.html

// Game globals
let timeLeft = 20;
let pts = 0;
let interval = setInterval(decreaseTimer, 1000);
let helter = {};
let gators = [];
let nGators = 0;
let preGame = true;

// return the direction needed for a to reach b
function getDir(aX, aY, bX, bY) {
  xDiff = aX - bX;
  yDiff = aY - bY;
  
  // go in random, idle direction if not near helter
  if (Math.abs(xDiff) > 5 && Math.abs(yDiff) > 5) {
    randVal = Math.floor(Math.random() * 4);
    switch (randVal) {
      case 0:
        return Direction.Up;
        break;
      case 1:
        return Direction.Left;
        break;
      case 2:
        return Direction.Down;
        break;
      case 3:
        return Direction.Right;
        break;
      default:
        return Direction.Up;
        break;
    }
  }
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff < 0)
      return Direction.Right;
    else
      return Direction.Left;
  }
  else {
    if (yDiff < 0)
      return Direction.Down;
    else
      return Direction.Up;
  }
}

// gators should not run into the marsh boundary
// or any previously placed gators
function isFree(nGator, x, y) {
  if ((x < 2) || (x > 21))
    return false;
  else if ((y < 2) || (y > 21))
    return false;
  else {
    for (var i = 0; i < nGator; i++) {
      const gator = gators[i];
      if ((x == gator.xHead) &&
        (y == gator.yHead) ||
        (x == gator.xTail) &&
        (y == gator.yTail))
        return false;
    }
    return true;
  }
}

function updateGators() {
  for (var i = 0; i < nGators; i++) {
    const gator = gators[i];
    
    // get direction of helter
    dir = getDir(gator.xHead, gator.yHead,
      helter.x, helter.y);
    
    // get spot in desired direction
    var val = 0;
    let spot = {};
    switch (dir) {
      case Direction.Up:
        spot = {
          x: gator.xHead,
          y: gator.yHead - 1
        };
        break;
      case Direction.Left:
        spot = {
          x: gator.xHead - 1,
          y: gator.yHead
        };
        val = 1;
        break;
      case Direction.Down:
        spot = {
          x: gator.xHead,
          y: gator.yHead + 1
        };
        val = 2;
        break;
      case Direction.Right:
        spot = {
          x: gator.xHead + 1,
          y: gator.yHead
        };
        val = 3;
        break;
      default:
        spot = {
          x: gator.xHead,
          y: gator.yHead
        };
        break;
    }

    // if free, go that direction
    // otherwise, go in random direction
    canGo = false;
    if (isFree(i, spot.x, spot.y))
      canGo = true;
    else {
      randVal = Math.floor(Math.random() * 4);
      
      for (var d = 0; d < 3; d++) {
        // we only want to attempt three other random directions
        // so skip the direction originally attempted
        if (randVal == val)
          randVal++;
        
        // get spot in desired direction
        switch (randVal % 4) {
          case 0:
            spot = {
              x: gator.xHead,
              y: gator.yHead - 1
            };
            break;
          case 1:
            spot = {
              x: gator.xHead - 1,
              y: gator.yHead
            };
            break;
          case 2:
            spot = {
              x: gator.xHead,
              y: gator.yHead + 1
            };
            break;
          case 3:
            spot = {
              x: gator.xHead + 1,
              y: gator.yHead
            };
            break;
          default:
            spot = {
              x: gator.xHead,
              y: gator.yHead
            };
            break;
        }
        
        if (isFree(i, spot.x, spot.y)) {
          canGo = true;
          break;
        }
        randVal++;
      }
    }
    if (canGo) {
      gators[i].xTail = gator.xHead;
      gators[i].yTail = gator.yHead;
      gators[i].xHead = spot.x;
      gators[i].yHead = spot.y;
    }
  }
}

function decreaseTimer() {
  if (!preGame)
    timeLeft--;
  if (timeLeft == 0) {
    clearInterval(interval);
  }
}

function create(game) {
  // generate helter
  helter = {
    x: 12,
    y: 12
  };

  // generate some number of gators between 2 and 7
  while (nGators < 2)
   nGators = Math.floor(Math.random() * 8);

  for (var i = 0; i < nGators; i++) {
    // create gator head inside of marsh, outside of starting square
    let head = {};
    var done = false;
    while (!done) {
      head = {
        x: (2 + (Math.floor(Math.random() * 19))),
        y: (2 + (Math.floor(Math.random() * 19)))
      };
      
      // if gator is generated inside starting square, pick again
      if ((head.x > 10 && head.x < 14) &&
        (head.y > 10 && head.y < 14))
        continue;
      
      // if gator collides with a previously generated gator, pick again
      var j = 0;
      for (j = 0; j < i; j++) {
        const gator = gators[j];
        if ((head.x == gator.xHead &&
            head.y == gator.yHead))
          break;
        else if ((head.x == gator.xTail &&
            head.y == gator.yTail))
          break;
      }

      if (j == i) {
        let newGator = {
          xHead: head.x,
          xTail: head.x+1,
          yHead: head.y,
          yTail: head.y
        };
        gators.push(newGator);
        game.setDot(newGator.xHead, newGator.yHead, Color.Orange);
        game.setDot(newGator.xTail, newGator.yTail, Color.Orange);
        done = true;
      }
    }
  }
}

function update(game) {
 
  // draw the marsh boundary
  for (var x = 0; x < 24; x++) {
    game.setDot(x, 0, Color.Blue);
    game.setDot(x, 1, Color.Blue);
    game.setDot(x, 22, Color.Blue);
    game.setDot(x, 23, Color.Blue);
  }
  for (var y = 2; y < 22; y++) {
    game.setDot(0, y, Color.Blue);
    game.setDot(1, y, Color.Blue);
    game.setDot(22, y, Color.Blue);
    game.setDot(23, y, Color.Blue);
  }

  game.setText(`Time remaining: ${timeLeft}s`);

  game.setDot(helter.x, helter.y, Color.Green);
  
  // game over :(
  for (var i = 0; i < nGators; i++) {
    const gator = gators[i];
    game.setDot(gator.xHead, gator.yHead, Color.Orange);
    game.setDot(gator.xTail, gator.yTail, Color.Orange);
    if ((helter.x == gator.xHead) &&
        (helter.y == gator.yHead) ||
        (helter.x == gator.xTail) &&
        (helter.y == gator.yTail)) {
      for (var j = i + 1; j < nGators; j++) {
        game.setDot(gators[j].xHead, gators[j].yHead, Color.Orange);
        game.setDot(gators[j].xTail, gators[j].yTail, Color.Orange);
      }
      game.setDot(helter.x, helter.y, Color.Red);
      game.setText(`Game Over!`);
      game.end();
      return;
    }
  }

  if (timeLeft <= 0) {
    game.setText(`You win!`);
    game.end();
  }
  
  if (preGame)
    game.setText(`Press any direction key to begin`);
  else
    updateGators();
}

function onKeyPress(direction) {
  if (preGame) {
    preGame = false;
    return;
  }
  if (direction == Direction.Up) {
    if (helter.y > 2) {
      helter.y--;
    }
  }
  else if (direction == Direction.Down) {
    if (helter.y < 21) {
      helter.y++;
    }
  }
  else if (direction == Direction.Left) {
    if (helter.x > 2) {
      helter.x--;
    }
  }
  else if (direction == Direction.Right) {
    if (helter.x < 21) {
      helter.x++;
    }
  }
}

let config = {
  create: create,
  update: update,
  frameRate: 4,
  onKeyPress: onKeyPress
};

let game = new Game(config);
game.run();
