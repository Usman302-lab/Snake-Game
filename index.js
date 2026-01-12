document.addEventListener('DOMContentLoaded', function () {

    const gameArena = document.getElementById('game-arena');
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0;
    let gameStarted = false;
    let food = { x: 300, y: 200 };
    let snake = [{x: 160, y: 200}, {x: 140, y: 200}, {x: 120, y: 200}];

    let dx = cellSize;
    let dy = 0;
    let intervalId;
    let gameSpeed = 200;
    
    function moveFood() {
        let newX, newY;
        do {
            newX = Math.floor(Math.random() * (arenaSize / cellSize)) * cellSize;
            newY = Math.floor(Math.random() * (arenaSize / cellSize)) * cellSize;
        } while(snake.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY));
        food = { x: newX, y: newY };
    }
    
    function updateSnake() {
        const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(newHead);

        if(newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            moveFood();
            if(gameSpeed > 50) {
                clearInterval(intervalId);
                gameSpeed -= 10;
                gameLoop();
            }
        } else {
            snake.pop();
        }
    }

    function changeDirection(e) {
        // Prevent default arrow key scrolling
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
        
        const isGoingDown = dy === cellSize;
        const isGoingUp = dy === -cellSize;
        const isGoingRight = dx === cellSize;
        const isGoingLeft = dx === -cellSize;
        
        if(e.key === 'ArrowUp' && !isGoingDown ) {
            dx = 0;
            dy = -cellSize;
        } else if(e.key === 'ArrowDown' && !isGoingUp) {
            dx = 0;
            dy = cellSize;
        } else if(e.key === 'ArrowLeft' && !isGoingRight) {
            dx = -cellSize;
            dy = 0;
        } else if(e.key === 'ArrowRight' && !isGoingLeft) {
            dx = cellSize;
            dy = 0;
        }
    }

    function drawDiv(x, y, className) {
        const divElement = document.createElement('div');
        divElement.classList.add(className);
        divElement.style.top = `${y}px`;
        divElement.style.left = `${x}px`;
        return divElement;
    }

    function drawFoodAndSnake() {
        gameArena.innerHTML = '';

        // Draw snake with different styling for head, body, and tail
        snake.forEach((snakeCell, index) => {
            let className;
            if(index === 0) {
                className = 'snake-head';
                // Add eyes to snake head based on direction
                const headElement = drawDiv(snakeCell.x, snakeCell.y, className);
                
                // Create eyes based on direction
                const eyeStyle = 'position:absolute;width:4px;height:4px;background-color:black;border-radius:50%;';
                const leftEye = document.createElement('div');
                const rightEye = document.createElement('div');
                
                if(dx > 0) { // Moving right
                    leftEye.style.cssText = eyeStyle + 'top:4px;left:12px;';
                    rightEye.style.cssText = eyeStyle + 'top:12px;left:12px;';
                } else if(dx < 0) { // Moving left
                    leftEye.style.cssText = eyeStyle + 'top:4px;left:4px;';
                    rightEye.style.cssText = eyeStyle + 'top:12px;left:4px;';
                } else if(dy > 0) { // Moving down
                    leftEye.style.cssText = eyeStyle + 'top:12px;left:4px;';
                    rightEye.style.cssText = eyeStyle + 'top:12px;left:12px;';
                } else if(dy < 0) { // Moving up
                    leftEye.style.cssText = eyeStyle + 'top:4px;left:4px;';
                    rightEye.style.cssText = eyeStyle + 'top:4px;left:12px;';
                }
                
                headElement.appendChild(leftEye);
                headElement.appendChild(rightEye);
                gameArena.appendChild(headElement);
                
            } else if(index === snake.length - 1) {
                className = 'snake-tail';
                gameArena.appendChild(drawDiv(snakeCell.x, snakeCell.y, className));
            } else {
                className = 'snake-body';
                gameArena.appendChild(drawDiv(snakeCell.x, snakeCell.y, className));
            }
        });

        const foodElement = drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement);
    }

    function isGameOver() {
        // Snake collision with itself
        for(let i = 1; i < snake.length; i++) {
            if(snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                return true;
            }
        }

        // Fixed wall collision - check if head is EXACTLY at or outside walls
        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x >= arenaSize; // Fixed: >= instead of >
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y >= arenaSize; // Fixed: >= instead of >
        
        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function gameLoop(){
        intervalId = setInterval(() => {
            if(isGameOver()){
                clearInterval(intervalId);
                gameStarted = false;
                document.removeEventListener('keydown', changeDirection);
                alert('Game Over!\nYour Score: ' + score);
                location.reload(); // Reload to restart
                return;
            }
            updateSnake();
            drawFoodAndSnake();
            drawScoreBoard();
        }, gameSpeed);
    }

    function runGame(){
        if(!gameStarted){
            gameStarted = true;
            document.addEventListener('keydown', changeDirection);
            gameLoop();
        }
    }

    function drawScoreBoard() {
        const scoreBoard = document.getElementById('score-board');
        scoreBoard.textContent = `Score: ${score}`;
    }

    function initiateGame(){
        const scoreBoard = document.createElement('div');
        scoreBoard.id = 'score-board';
        scoreBoard.textContent = 'Score: 0';
        document.body.insertBefore(scoreBoard, gameArena);
        
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.classList.add('start-button');
        startButton.addEventListener('click', function startGame(){
            startButton.style.display = 'none';
            runGame();
        });
        document.body.appendChild(startButton);
        
        // Draw initial state
        drawFoodAndSnake();
    }

    initiateGame();
});