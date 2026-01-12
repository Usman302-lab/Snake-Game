document.addEventListener('DOMContentLoaded', function () {

    const gameArena = document.getElementById('game-arena');
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0;
    let gameStarted = false;
     let snake = [{x: 160, y: 200}, {x: 140, y: 200}, {x: 120, y: 200}];
    
    // Fruit types with different scores
    const fruitTypes = [
        { class: 'apple', color: 'red', score: 10 },
        { class: 'orange', color: 'orange', score: 15 },
        { class: 'berry', color: 'pink', score: 20 },
        { class: 'grape', color: 'purple', score: 25 }
    ];
    
    let currentFruit = generateFruit();
    let dx = cellSize;
    let dy = 0;
    let intervalId;
    let gameSpeed = 200;
    let hasPoisonousFins = false;
    
    function generateFruit() {
        let newX, newY;
        let fruitType;
        
        do {
            newX = Math.floor(Math.random() * (arenaSize / cellSize)) * cellSize;
            newY = Math.floor(Math.random() * (arenaSize / cellSize)) * cellSize;
            fruitType = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
        } while(snake.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY));
        
        return {
            x: newX,
            y: newY,
            type: fruitType.class,
            color: fruitType.color,
            score: fruitType.score
        };
    }
    
    function updateSnake() {
        const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(newHead);

        // Check collision with fruit
        if(newHead.x === currentFruit.x && newHead.y === currentFruit.y) {
            // Eating effect
            const headElement = document.querySelector('.snake-head');
            if(headElement) {
                headElement.classList.add('eating');
                setTimeout(() => headElement.classList.remove('eating'), 300);
            }
            
            score += currentFruit.score;
            currentFruit = generateFruit();
            
            // Add poisonous fins every 3rd fruit eaten
            if(score % (currentFruit.score * 3) === 0) {
                hasPoisonousFins = true;
                setTimeout(() => {
                    hasPoisonousFins = false;
                }, 5000); // Fins last for 5 seconds
            }
            
            // Increase speed
            if(gameSpeed > 80) {
                clearInterval(intervalId);
                gameSpeed -= 5;
                gameLoop();
            }

        } else {
            snake.pop();
        }
    }

    function changeDirection(e) {
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

    function addEyes(headElement) {
        const leftEye = document.createElement('div');
        const rightEye = document.createElement('div');
        
        leftEye.classList.add('eye', 'left');
        rightEye.classList.add('eye', 'right');
        
        headElement.appendChild(leftEye);
        headElement.appendChild(rightEye);
    }

    function addFins(snakeElement, index) {
        if(!hasPoisonousFins || index === 0 || index === snake.length - 1) return;
        
        // Add poisonous fins to body segments
        const fins = ['fin-top', 'fin-bottom', 'fin-left', 'fin-right'];
        fins.forEach(finClass => {
            const fin = document.createElement('div');
            fin.classList.add('fin', finClass, 'poison-pulse');
            snakeElement.appendChild(fin);
        });
    }

    function drawFoodAndSnake() {
        gameArena.innerHTML = '';

        // Draw snake
        snake.forEach((snakeCell, index) => {
            let className;
            if(index === 0) {
                className = 'snake-head';
                const headElement = drawDiv(snakeCell.x, snakeCell.y, className);
                addEyes(headElement);
                addFins(headElement, index);
                gameArena.appendChild(headElement);
            } else if(index === snake.length - 1) {
                className = 'snake-tail';
                const tailElement = drawDiv(snakeCell.x, snakeCell.y, className);
                addFins(tailElement, index);
                gameArena.appendChild(tailElement);
            } else {
                className = 'snake-body';
                const bodyElement = drawDiv(snakeCell.x, snakeCell.y, className);
                addFins(bodyElement, index);
                gameArena.appendChild(bodyElement);
            }
        });

        // Draw fruit
        const fruitElement = drawDiv(currentFruit.x, currentFruit.y, 'fruit');
        fruitElement.classList.add(currentFruit.type);
        gameArena.appendChild(fruitElement);
    }

    function isGameOver() {
        // Self collision check
        for(let i = 1; i < snake.length; i++) {
            if(snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                return true;
            }
        }

        // Wall collision check
        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x >= arenaSize;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y >= arenaSize;
        
        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function showCollisionEffect() {
        const headElement = document.querySelector('.snake-head');
        if(headElement) {
            headElement.classList.add('collision');
            gameArena.classList.add('game-over');
            
            // Create explosion particles
            for(let i = 0; i < 10; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'absolute';
                particle.style.width = '8px';
                particle.style.height = '8px';
                particle.style.background = 'radial-gradient(circle, #ff0000, #ff4500)';
                particle.style.borderRadius = '50%';
                particle.style.top = `${snake[0].y + 10}px`;
                particle.style.left = `${snake[0].x + 10}px`;
                particle.style.zIndex = '100';
                particle.style.boxShadow = '0 0 10px #ff0000';
                
                const angle = Math.random() * Math.PI * 2;
                const speed = 5 + Math.random() * 10;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;
                
                gameArena.appendChild(particle);
                
                // Animate particle
                let posX = snake[0].x + 10;
                let posY = snake[0].y + 10;
                let opacity = 1;
                
                const particleInterval = setInterval(() => {
                    posX += vx;
                    posY += vy;
                    opacity -= 0.05;
                    
                    particle.style.left = `${posX}px`;
                    particle.style.top = `${posY}px`;
                    particle.style.opacity = opacity;
                    
                    if(opacity <= 0) {
                        clearInterval(particleInterval);
                        particle.remove();
                    }
                }, 30);
            }
        }
    }

    function gameLoop(){
        intervalId = setInterval(() => {
            if(isGameOver()){
                clearInterval(intervalId);
                gameStarted = false;
                document.removeEventListener('keydown', changeDirection);
                
                // Show collision effect
                showCollisionEffect();
                
                setTimeout(() => {
                    alert(`Game Over!\nFinal Score: ${score}\n\nFruits Collected: ${Math.floor(score / 10)}`);
                    location.reload();
                }, 1000);
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
        scoreBoard.textContent = `Score: ${score} ${hasPoisonousFins ? '⚡' : ''}`;
        scoreBoard.style.color = currentFruit.color;
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
        
        // Instructions
        const instructions = document.createElement('div');
        instructions.style.cssText = `
            color: #fff;
            margin-top: 20px;
            font-size: 14px;
            background: rgba(0,0,0,0.5);
            padding: 10px;
            border-radius: 10px;
            max-width: 600px;
        `;
        instructions.innerHTML = `
            <strong>🎯 How to Play:</strong><br>
            • Use arrow keys to control the snake<br>
            • Eat fruits to score points (different fruits = different points!)<br>
            • ⚡ Get poisonous fins by eating 3 fruits in a row<br>
            • Avoid hitting walls or yourself<br>
            <br>
            <strong>🍎 Fruits:</strong><br>
            • 🍎 Apple: 10 points<br>
            • 🍊 Orange: 15 points<br>
            • 🍓 Berry: 20 points<br>
            • 🍇 Grape: 25 points
        `;
        document.body.appendChild(instructions);
    }

    initiateGame();
});