// Get DOM elements
const gameBoard = document.getElementById('game-board');
const paddle = document.getElementById('.paddle');
const ball = document.getElementById('.ball');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const timerDisplay = document.getElementById('timer');

// Game variables
let paddlePositionX = 160;
let ballPositionX = 190;
let ballPositionY = 200;
const ballSpeed = 2;
const brickWidth = 60;
const brickHeight = 20;
class Brick {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + brickWidth, yAxis]
        this.topRight = [xAxis + brickWidth, yAxis + brickHeight]
        this.topLeft = [xAxis, yAxis + brickHeight]
    }
}

// Game loop
function gameLoop() {
    renderBricks(generateBricks());
    // Update game state
    //update();

    // Render game elements
    //render();

    // Request the next frame
   // requestAnimationFrame(gameLoop);
}

function updatePaddlePosition(paddleDirection) {
    // Update paddle position
    let paddleSpeed = 5;
    paddlePositionX += paddleDirection * paddleSpeed;
    const maxPosition = gameBoard.clientWidth - paddle.clientWidth;
    if (paddlePositionX > maxPosition) {
        paddlePositionX = maxPosition;
    } else if (paddlePositionX < 0) {
        paddlePositionX = 0;
    }
}

// Update game state
function update(deltaTime) {
    updatePaddlePosition();

    // Update ball position
    ballPositionX += ballDirectionX * ballSpeed * deltaTime / 16;
    ballPositionY += ballDirectionY * ballSpeed * deltaTime / 16;

    // Handle collisions with walls
    let ballDirectionX;
    if (ballPositionX <= 0 || ballPositionX >= gameBoard.clientWidth - ball.clientWidth) {
        ballDirectionX *= -1; // Reverse ball's X direction
    }
    let ballDirectionY;
    if (ballPositionY <= 0) {
        ballDirectionY *= -1; // Reverse ball's Y direction
    }

    // Handle collisions with paddle
    if (
        ballPositionY + ball.clientHeight >= gameBoard.clientHeight - paddle.clientHeight &&
        ballPositionX + ball.clientWidth >= paddlePositionX &&
        ballPositionX <= paddlePositionX + paddle.clientWidth
    ) {
        ballDirectionY = -1; // Reverse ball's Y direction
    }

    // TODO: Implement collision logic with bricks

    // Check game over condition
    if (ballPositionY >= gameBoard.clientHeight - ball.clientHeight) {
        // Player loses a life
        lives--;
        if (lives <= 0) {
            // Game over logic (to be implemented)
        } else {
            // Reset ball position and direction
            ballPositionX = gameBoard.clientWidth / 2 - ball.clientWidth / 2;
            ballPositionY = gameBoard.clientHeight / 2 - ball.clientHeight / 2;
            ballDirectionX = 1;
            ballDirectionY = -1;
        }
    }

    // Update timer
    timer++;
    timerDisplay.innerText = `Time: ${timer}`;
}
function generateBricks() {
//     // Generate bricks
    const brickRows = 3;
    const brickColumns = 5;
    const brickGap = 3;
    const bricks = [];
    console.log("Error3");
    for (let i = 0; i < brickRows; i++) {
        for (let j = 0; j < brickColumns; j++) {
            let brick = new Brick(j * (brickWidth + brickGap), i * (brickHeight + brickGap));
            if (i === 0 || i === 1){
               brick = {
                   color: "blue"
               }
            } else if (i >= 2){
                brick = {
                    color: "white"
                }
            }
            console.log(brick);
            bricks.push(brick);
        }
    }
    console.log(bricks)
    return bricks;
}
function renderBricks(bricks) {
    // Render bricks
    bricks.forEach(brick => {
        const brickElement = document.createElement('div');
        brickElement.classList.add('brick');
        brickElement.style.left = `${brick.x}px`;
        brickElement.style.top = `${brick.y}px`;
        brickElement.style.width = `${brick.width}px`;
        brickElement.style.height = `${brick.height}px`;
        brickElement.style.backgroundColor = brick.color;
        gameBoard.appendChild(brickElement);
    });
}




// Render game elements
function render() {
    // Update paddle's CSS position
    paddle.style.left = `${paddlePositionX}px`;

    // Update ball's CSS position
    ball.style.left = `${ballPositionX}px`;
    ball.style.top = `${ballPositionY}px`;

    // Update HUD elements
    // Update score, lives, timer display
}

function togglePauseMenu() {

    // Pause the game loop
    // Render pause menu
    // Add event listener for resume button
    // Resume the game loop
}

// Keyboard controls
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        movePaddleLeft();
    } else if (event.key === 'ArrowRight') {
        movePaddleRight();
    } else if (event.key === 'Space') {
        togglePauseMenu();
    }
});
function movePaddleLeft() {
    paddlePositionX -= 10;
    if (paddlePositionX < 0) {
        paddlePositionX = 0;
    }
}

function movePaddleRight() {
    paddlePositionX += 10;
    const maxPosition = gameBoard.clientWidth - paddle.clientWidth;
    if (paddlePositionX > maxPosition) {
        paddlePositionX = maxPosition;
    }
}

// Start the game loop
gameLoop();
