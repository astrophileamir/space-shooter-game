// Set up the canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let spaceship;
let bullets = [];
let enemies = [];
let score = 0;
let lastTime = 0;

// Spaceship object
const spaceshipImage = new Image();
spaceshipImage.src = "spaceship.png"; // Replace with your spaceship image path
spaceship = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    speed: 5,
    moveLeft: false,
    moveRight: false,
    moveUp: false,
    moveDown: false,
};

// Enemy object
const enemyImage = new Image();
enemyImage.src = "enemy.png"; // Replace with your enemy image path

// Bullet object
const bulletImage = new Image();
bulletImage.src = "bullet.png"; // Replace with your bullet image path

// Update score display
function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

// Move spaceship
function moveSpaceship() {
    if (spaceship.moveLeft && spaceship.x > 0) spaceship.x -= spaceship.speed;
    if (spaceship.moveRight && spaceship.x < canvas.width - spaceship.width) spaceship.x += spaceship.speed;
    if (spaceship.moveUp && spaceship.y > 0) spaceship.y -= spaceship.speed;
    if (spaceship.moveDown && spaceship.y < canvas.height - spaceship.height) spaceship.y += spaceship.speed;
}

// Draw spaceship
function drawSpaceship() {
    ctx.drawImage(spaceshipImage, spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

// Shoot bullets
function shootBullet() {
    const bullet = {
        x: spaceship.x + spaceship.width / 2 - 5,
        y: spaceship.y,
        width: 10,
        height: 20,
        speed: 5
    };
    bullets.push(bullet);
}

// Move bullets
function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed; // Move bullet upwards
        if (bullet.y < 0) {
            bullets.splice(index, 1); // Remove bullet if it goes off-screen
        }
    });
}

// Draw bullets
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Spawn enemies
function spawnEnemies() {
    if (Math.random() < 0.02) {
        const enemy = {
            x: Math.random() * (canvas.width - 50),
            y: -50,
            width: 50,
            height: 50,
            speed: 2
        };
        enemies.push(enemy);
    }
}

// Move enemies
function moveEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1); // Remove enemy if it goes off-screen
        }
    });
}

// Draw enemies
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Collision detection (bullet hit enemy)
function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                // Collision detected, increase score
                score += 10;
                updateScore();
                enemies.splice(eIndex, 1); // Remove enemy
                bullets.splice(bIndex, 1); // Remove bullet
            }
        });
    });
}

// Update game elements
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    moveSpaceship();
    drawSpaceship();
    moveBullets();
    drawBullets();
    spawnEnemies();
    moveEnemies();
    drawEnemies();
    checkCollisions();

    requestAnimationFrame(update); // Continuously call the update function
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') spaceship.moveLeft = true;
    if (event.key === 'ArrowRight') spaceship.moveRight = true;
    if (event.key === 'ArrowUp') spaceship.moveUp = true;
    if (event.key === 'ArrowDown') spaceship.moveDown = true;
    if (event.key === ' ') shootBullet();
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') spaceship.moveLeft = false;
    if (event.key === 'ArrowRight') spaceship.moveRight = false;
    if (event.key === 'ArrowUp') spaceship.moveUp = false;
    if (event.key === 'ArrowDown') spaceship.moveDown = false;
});

// Start the game
update();
