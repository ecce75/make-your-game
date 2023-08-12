// Get DOM elements
const gameBoard = document.getElementById('game-board');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
let scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const timerDisplay = document.getElementById('timer');

let gameOver = true;
let isPaused = true;
let start = true;
let lives = 3;
let score = 0;

class Brick {
    color;
    constructor(xAxis, yAxis) {
        this.x = xAxis;
        this.y = yAxis;
    }
}
const brickWidth = 119;
const brickHeight = 30;
const bricks = [];

const ballStart = [360, 399]
let ballCurrentPosition = ballStart
let ballDirectionX = 1;
let ballDirectionY = -1;
let ballSpeed = 2;

const userStart = [313, 410]
let paddleCurrentPosition = userStart

let previousTime = performance.now();
let pauseTime = null;
let animationFrameId;

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        movePaddleLeft();
    } else if (event.key === 'ArrowRight') {
        movePaddleRight();
    } else if (event.key === 'Enter') {
        resetGame();
    } else if (event.key === ' ' || event.key === 'Space') {
        if (gameOver === true) {
            renderBricks(generateBricks());
            gameLoop();
            gameOver = false;
        } else {
            if (start === true) {
                start = false
                isPaused = false
            }else {
                togglePauseMenu();
            }
        }
    }
});
function movePaddleLeft() {
    paddleCurrentPosition[0] -= 15;
    if (paddleCurrentPosition[0] < 0) {
        paddleCurrentPosition[0] = 0;
    }
}

function movePaddleRight() {
    paddleCurrentPosition[0] += 15;
    const maxPosition = gameBoard.clientWidth - paddle.clientWidth;
    if (paddleCurrentPosition[0] > maxPosition) {
        paddleCurrentPosition[0] = maxPosition;
    }
}
// Update game state

// Game loop
function gameLoop() {
    if (isPaused) {
        if (pauseTime === null) {
            pauseTime = performance.now();
            cancelAnimationFrame(animationFrameId);
        }
    } else {
        // Calculate time since last frame
        if (pauseTime !== null) {
            previousTime += performance.now() - pauseTime;
            pauseTime = null;
        }
        const deltaTime = performance.now() - previousTime;
        previousTime = performance.now();

        // Update game state
        update(deltaTime);

        // Render game elements
        render();

        if (gameOver === true) {
            cancelAnimationFrame(animationFrameId);
            return;
        }
    }
    animationFrameId = requestAnimationFrame(gameLoop);
}
function update(deltaTime) {
    ballSpeed *= 1.0003;

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
        ballCurrentPosition[1] + ball.clientHeight >= gameBoard.clientHeight - 40 &&
        ballCurrentPosition[0] + ball.clientWidth >= paddleCurrentPosition[0] &&
        ballCurrentPosition[0] <= paddleCurrentPosition[0] + paddle.clientWidth
    ) {
        ballDirectionY *= -1; // Reverse ball's Y direction
    } else if (ballCurrentPosition[0] + ball.clientWidth >= paddleCurrentPosition[0] &&
        ballCurrentPosition[0] <= paddleCurrentPosition[0] + paddle.clientWidth &&
        ballCurrentPosition[1] + ball.clientHeight >= gameBoard.clientHeight - paddle.clientHeight) {
        ballDirectionX *= -1; // Reverse ball's X direction
    }

    for (let i = 0; i < bricks.length; i++){
        const brick = bricks[i];

        const ballCenterX = ballCurrentPosition[0] + ball.clientWidth / 2;
        const ballCenterY = ballCurrentPosition[1] + ball.clientHeight / 2;

        const brickCenterX = brick.x + brickWidth / 2;
        const brickCenterY = brick.y + brickHeight / 2;

        const deltaX = ballCenterX - brickCenterX;
        const deltaY = ballCenterY - brickCenterY;

        if
        (
            // Collision with top or bottom of the brick
            (Math.abs(deltaY) < brickHeight / 2 + ball.clientHeight / 2) &&
            (Math.abs(deltaX) < brickWidth / 2)
            ||
            // Collision with left or right side of the brick
            (Math.abs(deltaX) < brickWidth / 2 + ball.clientWidth / 2) &&
            (Math.abs(deltaY) < brickHeight / 2))
        {
            const allBlocks = Array.from(document.querySelectorAll('.brick'))
            if (brick.color === "orange"){
                brick.color = "green"
                const brickElement = document.getElementsByClassName('brick')[i];
                brickElement.style.backgroundColor = brick.color;
            } else if (brick.color === "green"){
                brick.color = "blue"
                const brickElement = document.getElementsByClassName('brick')[i];
                brickElement.style.backgroundColor = brick.color;
            } else {
                allBlocks[i].classList.remove('brick')
                bricks.splice(i,1)
            }

            if ((Math.abs(deltaY) < brickHeight / 2 + ball.clientHeight / 2) &&
                (Math.abs(deltaX) < brickWidth / 2)) {
                ballDirectionY *= -1; // Reverse ball's Y direction
            } else {
                ballDirectionX *= -1; // Reverse ball's X direction
            }
            score += 200;
            scoreDisplay.innerHTML = "Score: " + score.toString()
            if (bricks.length === 0) {
                scoreDisplay.innerHTML = 'You Win!'
                document.removeEventListener('keydown', gameLoop)
            }
        }
    }

    // Check game over condition
    if (ballCurrentPosition[1] >= gameBoard.clientHeight - ball.clientHeight){
        // Player loses a life
        start = true;
        ballSpeed = 2;
        lives--;
        document.getElementById('lives').innerHTML = "Lives: " + lives.toString();
        if (lives <= 0) {
            // Game over logic (to be implemented)
            console.log("Game over!");
            gameOver = true;
        } else {
            // Reset ball position and direction
            paddleCurrentPosition = [313, 410]
            ballCurrentPosition = [360, 399]
            ballDirectionX = 1;
            ballDirectionY = -1;
            render()
            isPaused = true;
        }
    }

}


function resetGame() {
    paddleCurrentPosition = [313, 410]
    ballCurrentPosition = [360, 399]
    ballDirectionX = 1;
    ballDirectionY = -1;
    score = 0;
    lives = 3;
    scoreDisplay.innerHTML = "Score: " + score.toString()
    document.getElementById('lives').innerHTML = "Lives: " + lives.toString();
    const brickElements = document.querySelectorAll('.brick');
    brickElements.forEach(brickElement => {
        brickElement.parentNode.removeChild(brickElement);
    });
    renderBricks(generateBricks());
    render()
    isPaused = true;
}
// Render game elements
function render() {
    // Update paddle's CSS position
    paddle.style.left = `${paddleCurrentPosition[0]}px`;
    paddle.style.top = `${paddleCurrentPosition[1]}px`;
    // Update ball's CSS position
    ball.style.left = `${ballCurrentPosition[0]}px`;
    ball.style.top = `${ballCurrentPosition[1]}px`;
}

function togglePauseMenu() {
    const pauseMenu = document.getElementById('pause-menu');
    const isHidden = pauseMenu.classList.contains('hidden');
    console.log(isHidden)
    if (isHidden) {
        pauseMenu.classList.remove('hidden');
        isPaused = true; // Pause the game loop
    } else {
        pauseMenu.classList.add('hidden');
        isPaused = false; // Resume the game loop
    }
}

function generateBricks() {
//     // Generate bricks
    const brickRows = 4;
    const brickColumns = 6;
    const brickGap = 10;
    for (let i = 0; i < brickRows; i++) {
        for (let j = 0; j < brickColumns; j++) {
            let brick = new Brick(j * (brickWidth) + brickGap, i * (brickHeight) + brickGap);
            if (i === 3){
                brick.color = "orange";
            } else if (i === 2){
                brick.color = "green";
            } else if (i <= 1){
                brick.color = "blue";
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

    paddle.style.left = `${paddleCurrentPosition[0]}px`;
    paddle.style.top = `${paddleCurrentPosition[1]}px`;
    ball.style.left = `${ballCurrentPosition[0]}px`;
    ball.style.top = `${ballCurrentPosition[1]}px`;
}

function initializeGame() {
    renderBricks(generateBricks());
    gameLoop()
}

while (gameOver === true)   {
    gameOver = false;
    initializeGame();
}


