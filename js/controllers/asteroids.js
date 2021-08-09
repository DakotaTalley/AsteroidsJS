// Set up scene
let canvas = new Canvas("game-canvas")
let width = canvas.width
let height = canvas.height

// Set up High Score
if(!localStorage.getItem('high')) {
    localStorage.setItem('high', 0)
}

// Reset High Score Button
const rButton = document.getElementById('reset-high')
rButton.addEventListener('click', function(e) { localStorage.setItem('high', 0); })

// Set up entities
let spaceship = new Spaceship(width/2, height/2)

// Set up sounds
let sPew = new Sound("assets/Laser_Shoot.wav", .1)
let sBoom = new Sound("assets/Explosion.wav", .25)

// Set up input
let keys = []

window.onkeyup = (e) => { 
    keys[e.code] = false 
    pframe = true
}

window.onkeydown = (e) => { 
    keys[e.code] = true
    e.preventDefault()
 }

// Set up game variables
const SPAWNS = ["TOP", "RIGHT", "BOTTOM", "LEFT"]
let paused = true
let newGame = true
let pframe = true
let message = "Choose your Difficulty."
let difficulty = new Difficulty()
let frame;
let score = 0;
let lives

// Set up timing variables
let GAME_FPS = 60
let lastTick = performance.now()
let t = 0
let dt = .01
let accumulator = 0
let timeLastPause = performance.now()

// Run Game Function
let startGame = () => {
    queueTick()
}

// Reset Game Function
let reset = () => {
    frame = 1
    lives = 2
    paused = true

    asteroids = []
    bullets = []

    spaceship.reset(width, height)
}

// Wait for next frame and call Game Loop
let queueTick = () => {
    window.requestAnimationFrame(gameTick)
}

// Game Loop
let gameTick = () => {
    // Check for Paused
    if (paused) {
        let now = performance.now()

        if (now - timeLastPause > 1000 && (keys["Enter"] || keys["KeyP"])) {
            pauseGame(paused)
        }

        if (!newGame) {
            drawMessage()
        }

    } else {
        // update timing
        updateTiming()

        // update game variables
        updateGame()

        // check input
        checkInput()

        // update physics
        while (accumulator >= dt) {
            updatePhysics()
            accumulator -= dt
        }

        // render graphics
        renderGraphics()
    }

    // Check for New Game
    if (newGame) {
        drawMessage()

        chooseDiff()
    }

    // queue next gameTick
    queueTick()
}

let updateTiming = () => {
    let current = performance.now()
    let elapsed = current - lastTick
    lastTick = current
    accumulator += elapsed
}

let updateGame = () => {
    // Update High Score
    if (localStorage.getItem('high') < score) {
        localStorage.setItem('high', score)
    }

    // Frame Counter
    if (frame <= GAME_FPS) {
        frame += 1
    } else {
        frame = 1
    }

    // Per second score
    if (frame == 60) {
        score++
    }

    // New Life Check
    if (score % 50 == 0 && frame == 60) {
        lives++
    }
}

let checkInput = () => {
    // Ship Rotation
    if (keys["KeyA"] || keys["ArrowLeft"]) {
        spaceship.rotate(-2)
    }
    if (keys["KeyD"] || keys["ArrowRight"]) {
        spaceship.rotate(2)
    }

    // Ship Acceleration / Deceleration
    if (keys["KeyW"] || keys["ArrowUp"]) {
        spaceship.accelerate(dt)
    }
    if (keys["KeyS"] || keys["ArrowDown"]) {
        spaceship.decelerate(dt)
    }

    // Pause
    if ( (keys["Enter"] || keys["KeyP"])) {
        let now = performance.now()

        if (now - timeLastPause > 2000) {
            pauseGame(paused)
        }
    }

    // Shooting
    if (keys["Space"]) {
        let now = performance.now()

        if (now - spaceship.timeLastShoot > 250) {
            bullets.push(spaceship.shoot(frame))
            spaceship.timeLastShoot = now
            sPew.play()
        };
    }
}

let updatePhysics = () => {
    // Update Scene
    // Asteroid Spawning
    if (asteroids.length < Math.log(score) && frame % 30 == 0) {
        spawnAsteroid()
    }


    // Update Positions
    spaceship.updatePosition(width, height, dt)

    if (bullets.length > 0) {
        for (item in bullets) {
            bullets[item].updatePosition(width, height, dt)
        }
    }

    if (asteroids.length > 0) {
        for (item in asteroids) {
            asteroids[item].updatePosition(width, height, dt)
        }
        //console.log(asteroids[0])
    }
    //

    // Check for Collisions
    // Aseteroids and Ship
    for (let i = 0; i < asteroids.length; i++) {
        if (spaceship.checkCollision(asteroids[i])) {
            sBoom.play()

            if (lives > 0) {
                newLife()
            } else {
                message = "Game Over. Choose your Difficulty for new game."
                newGame = true
                reset()
            }
        }
    }

    // Asteroids and Bullets
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < asteroids.length; j++) {
            if (bullets[i].checkCollision(asteroids[j])) {
                bullets.splice(i, 1)
                newA = asteroids[j].split()

                if (newA == 0) {
                    asteroids.splice(j, 1)
                    score += difficulty.getDiff()

                    // New Life Check
                    if (score % 150 <= (difficulty.getDiff() - 1)) {
                        lives++
                    }
                } else {
                    asteroids.push(newA[0])
                    asteroids.push(newA[1])
                    asteroids.splice(j, 1)
                }

                sBoom.play()

                break
            }
        }
    }
}

let newLife = () => {
    spaceship.reset(width, height)
    lives--
    asteroids = []
    bullets = []
}

let pauseGame = (bool) => {
    if (bool) {
        paused = !paused
        message = "Paused"
        pframe = false
    } else {
        paused = !paused
        pframe = false
    }
}

let spawnAsteroid = () => {
    let sIndex = Math.floor(Math.random() * 4)
    let aSize = Math.floor(Math.random() * 3 + 1)
    let spawnx = 0
    let spawny = 0
    let spawndx = 0
    let spawndy = 0
    let newAsteroid

    switch (SPAWNS[sIndex]) {
        case "TOP":
            spawnx = Math.random() * width
            spawndx = Math.random() * .2
            spawndy = Math.random() * .2

            spawndx *= Math.floor(Math.random()*2) == 1 ? 1 : -1

            newAsteroid = new Asteroid(spawnx, 0, spawndx, spawndy, aSize, 6)

            break;
        case "RIGHT":
            spawny = Math.random() * height
            spawndx = Math.random() * -.2
            spawndy = Math.random() * .2

            spawndy *= Math.floor(Math.random()*2) == 1 ? 1 : -1

            newAsteroid = new Asteroid(width, spawny, spawndx, spawndy, aSize, 6)

            break;
        case "BOTTOM":
            spawnx = Math.random() * width
            spawndx = Math.random() * .2
            spawndy = Math.random() * -.2

            spawndx *= Math.floor(Math.random()*2) == 1 ? 1 : -1

            newAsteroid = new Asteroid(spawnx, height, spawndx, spawndy, aSize, 6)

            break;
        case "LEFT":
            spawny = Math.random() * height
            spawndx = Math.random() * .2
            spawndy = Math.random() * .2

            spawndy *= Math.floor(Math.random()*2) == 1 ? 1 : -1

            newAsteroid = new Asteroid(0, spawny, spawndx, spawndy, aSize, 6)

            break;
    }

    asteroids.push(newAsteroid)
}

// Draw Scene
let renderGraphics = () => {
    canvas.setBackground("#000000")

    // Draw the spaceship
    canvas.drawSpaceship(spaceship)

    // Draw the asteroids
    for (let i = 0; i < asteroids.length; i++) {
        canvas.drawAsteroids(asteroids[i], asteroids[i].getBounds())
    }

    // Draw the bullets
    for (let i = 0; i < bullets.length; i++) {
        if (!bullets[i].checkDistance(frame)) {
            canvas.drawBullets(bullets[i])
        } else {
            bullets.splice(i, 1)
        }
    }

    // Draw the score
    canvas.drawScore(score)

    // Draw the High Score
    canvas.drawHigh(localStorage.getItem('high'))

    // Draw the lives
    canvas.drawLives(lives, spaceship)
}

let chooseDiff = () => {
    if((pframe && keys["KeyD"]) || (pframe && keys["ArrowRight"])) {
        difficulty.increaseDiff()
        pframe = false
    }

    if((pframe && keys["KeyA"]) || (pframe && keys["ArrowLeft"])) {
        difficulty.decreaseDiff()
        pframe = false
    }

    if((keys["Enter"] || keys["Space"])) {
        newGame = !newGame
        score = 0
        reset()
        pauseGame(false)
    }

    canvas.drawDiff(difficulty.getDiff())
}

// Draw Message
let drawMessage = () => {
    canvas.setBackground("#000000")
    canvas.drawScore(score)
    canvas.drawHigh(localStorage.getItem('high'))
    canvas.drawLives(lives, spaceship)

    canvas.drawPaused(message)
}

// Start Game
reset()
startGame()