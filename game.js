const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let spaceship;
let lasers = [];
let enemies = [];
let score = 0;

// Load images
const spaceshipImg = new Image();
spaceshipImg.src = "assets/spaceship.png";

const enemyImg = new Image();
enemyImg.src = "assets/enemy.png";

const laserImg = new Image();
laserImg.src = "assets/laser.png";

// Spaceship class
class Spaceship {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 5;
        this.dx = 0;
    }

    move() {
        this.x += this.dx;

        // Boundaries
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    }

    draw() {
        ctx.drawImage(spaceshipImg, this.x, this.y, this.width, this.height);
    }

    shoot() {
        lasers.push(new Laser(this.x + this.width / 2 - 5, this.y, 10));
    }
}

// Laser class
class Laser {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 20;
        this.speed = speed;
    }

    move() {
        this.y -= this.speed;
    }

    draw() {
        ctx.drawImage(laserImg, this.x, this.y, this.width, this.height);
    }
}

// Enemy class
class Enemy {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = speed;
    }

    move() {
        this.y += this.speed;
    }

    draw() {
        ctx.drawImage(enemyImg, this.x, this.y, this.width, this.height);
    }
}

// Detect collision
function detectCollision(laser, enemy) {
    return (
        laser.x < enemy.x + enemy.width &&
        laser.x + laser.width > enemy.x &&
        laser.y < enemy.y + enemy.height &&
        laser.y + laser.height > enemy.y
    );
}

// Update game elements
function update() {
    // Move spaceship
    spaceship.move();

    // Move lasers
    lasers.forEach((laser, index) => {
        laser.move();
        if (laser.y < 0) {
            lasers.splice(index, 1); // Remove laser when it goes off screen
        }
    });

    // Move enemies
    enemies.forEach((enemy, index) => {
        enemy.move();
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1); // Remove enemy when it goes off screen
        }

        // Check collision with laser
        lasers.forEach((laser, laserIndex) => {
            if (detectCollision(laser, enemy)) {
                // Increase score, remove enemy and laser
                score += 10;
                enemies.splice(index, 1);
                lasers.splice(laserIndex, 1);
            }
        });
    });

    // Spawn new enemies
    if (Math.random() < 0.02) {
        enemies.push(new Enemy(Math.random() * (canvas.width - 50), 0, 2));
    }

    // Clear screen and draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    spaceship.draw();
    lasers.forEach(laser => laser.draw());
    enemies.forEach(enemy => enemy.draw());

    // Update score
    document.getElementById("score").innerText = `Score: ${score}`;

    requestAnimationFrame(update);
}

// Game start
function startGame() {
    spaceship = new Spaceship(canvas.width / 2 - 25, canvas.height - 70);

    // Keypress controls
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") spaceship.dx = -spaceship.speed;
        if (e.key === "ArrowRight") spaceship.dx = spaceship.speed;
        if (e.key === " ") spaceship.shoot(); // Space for shooting
    });

    document.addEventListener("keyup", (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") spaceship.dx = 0;
    });

    update();
}

// Start the game
startGame();
