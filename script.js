// Get DOM elements
const gameBoard = document.getElementById('game-board');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const timerDisplay = document.getElementById('timer');

const bricks = [];
let ballDirectionX = 1;
let ballDirectionY = -1;

const userStart = [230, 280]
let paddleCurrentPosition = userStart

const ballStart = [270, 40]
let ballCurrentPosition = ballStart

const ballSpeed = 2;
let lives = 3;

const brickWidth = 110;
const brickHeight = 20;
class Brick {
    color;
    constructor(xAxis, yAxis) {
        this.x = xAxis;
        this.y = yAxis;
    }
}

let previousTime = performance.now();
// Game loop
function gameLoop() {
    const deltaTime = performance.now() - previousTime;
    previousTime = performance.now();

    // Update game state
    update(deltaTime);

    // Render game elements
    render();

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

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
    console.log("move left")
    paddleCurrentPosition[0] -= 10;
    if (paddleCurrentPosition[0] < 0) {
        paddleCurrentPosition[0] = 0;
    }
}

function movePaddleRight() {
    console.log("move right")
    paddleCurrentPosition[0] += 10;
    const maxPosition = gameBoard.clientWidth - paddle.clientWidth;
    if (paddleCurrentPosition[0] > maxPosition) {
        paddleCurrentPosition[0] = maxPosition;
    }
}
// Update game state
function update(deltaTime) {

    // Update ball position
    ballCurrentPosition[0] += ballDirectionX * ballSpeed * deltaTime / 16;
    ballCurrentPosition[1] += ballDirectionY * ballSpeed * deltaTime / 16;

    // Handle collisions with walls
    if (ballCurrentPosition[0] <= 0 || ballCurrentPosition[0] >= gameBoard.clientWidth - ball.clientWidth) {
        ballDirectionX *= -1; // Reverse ball's X direction
    }
    if (ballCurrentPosition[1] <= 0) {
        ballDirectionY *= -1; // Reverse ball's Y direction
    }

    // Handle collisions with paddle
    if (
        ballCurrentPosition[1] + ball.clientHeight >= gameBoard.clientHeight - paddle.clientHeight &&
        ballCurrentPosition[0] + ball.clientWidth >= paddleCurrentPosition[0] &&
        ballCurrentPosition[0] <= paddleCurrentPosition[0] + paddle.clientWidth
    ) {
        console.log("Hit paddle!")
        ballDirectionY *= -1; // Reverse ball's Y direction
    }

    // TODO: Implement collision logic with bricks
    for (let i = 0; i < bricks.length; i++){
        if
        (
            (ballCurrentPosition[0] > bricks[i].x && ballCurrentPosition[0] < bricks[i].bottomRightup[0]) &&
            ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])
        )
        {
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i,1)
            changeDirection()
            score++
            scoreDisplay.innerHTML = score
            if (blocks.length == 0) {
                scoreDisplay.innerHTML = 'You Win!'
                clearInterval(timerId)
                document.removeEventListener('keydown', moveUser)
            }
        }
    }

    // Check game over condition
    if (ballCurrentPosition[1] >= gameBoard.clientHeight - ball.clientHeight) {
        // Player loses a life
        lives--;
        if (lives <= 0) {
            // Game over logic (to be implemented)
            console.log("Game over!");
            throw new Error();
        } else {
            // Reset ball position and direction
            ballCurrentPosition[0] = gameBoard.clientWidth / 2 - ball.clientWidth / 2;
            ballCurrentPosition[1] = gameBoard.clientHeight / 2 - ball.clientHeight / 2;
            ballDirectionX = 1;
            ballDirectionY = -1;
        }
    }

}






// Render game elements
function render() {
    // Update paddle's CSS position
    paddle.style.left = `${paddleCurrentPosition[0]}px`;
    paddle.style.top = `${paddleCurrentPosition[1]}px`;
    console.log(paddle.style.left, paddle.style.top)
    // Update ball's CSS position
    ball.style.left = `${ballCurrentPosition[0]}px`;
    ball.style.top = `${ballCurrentPosition[1]}px`;

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

function generateBricks() {
//     // Generate bricks
    const brickRows = 4;
    const brickColumns = 5;
    const brickGap = 10;
    for (let i = 0; i < brickRows; i++) {
        for (let j = 0; j < brickColumns; j++) {
            let brick = new Brick(j * (brickWidth) + brickGap, i * (brickHeight) + brickGap);
            if (i === 0 || i === 1){
                brick.color = "blue";
            } else if (i >= 2){
                brick.color = "white";
            }
            bricks.push(brick);
        }
    }
    return bricks;
}
function renderBricks(bricks) {
    bricks.forEach(brick => {
        const brickElement = document.createElement('div');
        brickElement.classList.add('brick');
        brickElement.style.left = `${brick.x}px`;
        brickElement.style.top = `${brick.y}px`;
        brickElement.style.backgroundColor = brick.color;
        gameBoard.appendChild(brickElement);
    });
}
renderBricks(generateBricks());
// Start the game loop
gameLoop();
