// --- Canvas Boilerplate ---
const canvas = document.querySelector('canvas')
const scoreEl = document.querySelector("#scoreEl")
const highScoreEl = document.querySelector("#highScoreEl")
const c = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 720

// --- Keep Images "Pixelated" ---
c.imageSmoothingEnabled = false

let engineParticleColor = Math.random()
if (engineParticleColor < 0.51) {
    engineParticleColor = "rgba(255, 100, 240, 0.5)"
} else {
    engineParticleColor = "rgba(255, 240, 180, 0.5)"
}

const speed = 10
const rotate = 0.15

let highScore = 0
/* The above code is attempting to retrieve a saved high score from the browser's local storage. It
uses `localStorage.getItem("savedHighScore")` to get the value stored under the key "savedHighScore"
and then converts it to an integer using `parseInt()`. The result is stored in the variable
`savedHighScore`. */
let savedHighScore = parseInt(localStorage.getItem("savedHighScore"))

console.log(highScore)

// --- Monitors Keys ---
let keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    },
    
};

let randomInterval = Math.floor(Math.random() * 500 + 600)

let game = {
    over: false,
    active: true
}

let score = 0
let frames = 0
let spawnFrames = 0

let projectiles = []
let player = new Player()
let grids = []
let invaderProjectiles = []
let particles = []
let bombs = []
let powerUps = []

let spawnInterval = 500

let fps = 120
let fpsInterval = 1000 / fps
let msPrev = window.performance.now()

function init() {
    projectiles = []
    player = new Player()
    grids = []
    invaderProjectiles = []
    particles = []
    bombs = []
    powerUps = []
    keys = {
        a: {
            pressed: false
        },
        d: {
            pressed: false
        },
        space: {
            pressed: false
        },
    }
    randomInterval = Math.floor(Math.random() * 500 + 600)
    game = {
        over: false,
        active: true
    }

    score = 0
    frames = 0
    spawnFrames = 0

    // --- spawn stars ---
    for (let i = 0; i < 100; i++) {
    particles.push(
        new Particle({
            position: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            velocity: {
                x: 0,
                y: Math.random() * 1.25 + 0.2
            },
            radius: Math.random() * 2,
            color: particleColorStars
            })
        )
    }

    if (!localStorage.getItem("savedHighScore")) {
        localStorage.setItem("savedHighScore", 0)
    }
};

function endGame() {
    audio.playerDied.play()

    player.image.src = "./img/Player/Foozle_2DS0011_Void_MainShip/Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Bases/PNGs/Main Ship - Base - Damaged.png"
    gsap.to(player, {
        opacity: 0
    })

    game.over = true

    setTimeout(() => {
        game.active = false
        document.querySelector("#restartScreen").style.display = "flex"
        document.querySelector("#yourScoreEl").innerHTML = score + " pts"
        
        /* The above code is checking if the current score is greater than or equal to both the high
        score and the saved high score. If it is, it updates the saved high score in the local
        storage, updates the high score displayed on the webpage, changes the color of the high
        score element to gold using GSAP animation. If the current score is not higher than both
        high scores, it retrieves the saved high score from local storage and updates the high score
        displayed on the webpage. */
        if (score >= highScore && score >= savedHighScore) {
            localStorage.setItem("savedHighScore", score)
            highScore = score
            highScoreEl.innerHTML = score + " pts"
            gsap.to(highScoreEl, {
                color: "gold",
                delay: .25,
                duration: 1
            })
        } else {
            highScoreEl.innerHTML = parseInt(localStorage.getItem("savedHighScore")) + "pts"
            highScore = highScore
            highScoreEl.style.color = 'white'
        }
    }, 1500)

    createParticles({
    object: player,
    color: "#F42C04",
    })

    keys.space.pressed = false

    engineParticleColor = "rgba(0, 0, 0, 0.01)"
};

// --- Animate Function ---
function animate() {
    if (!game.active) return
    requestAnimationFrame(animate)

    const msNow = window.performance.now()
    const elapsed = msNow - msPrev

    if (elapsed < 16.66) return

    msPrev = msNow - (elapsed % 16.66)

    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i]
        
        if (powerUp.position.x - powerUp.radius >= canvas.width) {
            powerUps.splice(i, 1)
        } else {
            powerUp.update()
        }
    }

    // --- spawn power-ups ---
    if (spawnFrames % 1500 === 0 && spawnFrames > 1) {
        powerUps.push(
            new PowerUpMachineGun({
                position: {
                    x: -15,
                    y: (Math.random() * 500) + 15 
                },
                velocity: {
                    x: (Math.random() * 5) + 3,
                    y: 0
                },
                radius: 22
            })
        )
    }

    // --- spawn bombs ---
    if (spawnFrames % 800 === 0 && bombs.length < 2) {
        bombs.push(
            new Bomb({
                position: {
                    x: randomBetween(Bomb.radius, canvas.width - Bomb.radius),
                    y: randomBetween(Bomb.radius, canvas.height - Bomb.radius)
                },
                velocity: {
                    x: (Math.random() - 0.5) * 6,
                    y: (Math.random() - 0.5) * 6
                }
            })
        )
    }

    for (let i = bombs.length - 1; i >= 0; i--) {
        const bomb = bombs[i]

        if (bomb.opacity <= 0) {
            bombs.splice(i, 1)
        } else bomb.update()
    }

    player.update()

    gunBase.update()
    if(keys.space.pressed && !player.powerUp){
        gunBase.fire()
    } 

    machineGun.update()
    if (keys.space.pressed && player.powerUp === "MachineGun") {
        machineGun.fire()
    }

    // --- Particle color picker ---
    let particleColorInvader = Math.random() - 0.5
        if (particleColorInvader <= 0) {
            particleColorInvader = "#484a77"
        } else {
            particleColorInvader = "#635666"
        }

    let particleColorPlayer = Math.random() - 0.5
        if (particleColorPlayer <= 0) {
            particleColorPlayer = "#d5e5dc"
        } else if (particleColorPlayer > 0 && particleColorPlayer <= 0.3) {
            particleColorPlayer = "#9a453c"
        } else {
            particleColorPlayer = "#c7dcd0"
        }

    // --- particle rendering ---
    for (let i = player.particles.length - 1; i >= 0; i--) {
        const particle = player.particles[i]
        particle.update()

        if (particle.opacity === 0) player.particles[i].splice(i, 1)
    }

    particles.forEach((particle, i) => {
        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }

        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0)
        } else {
            particle.update()
        }
    })

    // --- invader projectile rendering + cleanup ---
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height >=
            canvas.height) {
                setTimeout(() => {
                    invaderProjectiles.splice(index, 1)
                }, 0)
        } else {
            invaderProjectile.update()
        }

        // --- Projectile hits player ---
        if (rectangularCollision({
            rectangle1: invaderProjectile,
            rectangle2: player
        })
        ) {
            setTimeout(() => {

                invaderProjectiles.splice(index, 1)
                player.hit++
                // --- change player sprite on hit and game over ---
                if (player.hit === 1) {
                    player.image.src = "./img/Player/Foozle_2DS0011_Void_MainShip/Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Bases/PNGs/Main Ship - Base - Slight damage.png"
                } else if (player.hit === 2) {
                    player.image.src = "./img/Player/Foozle_2DS0011_Void_MainShip/Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Bases/PNGs/Main Ship - Base - Damaged.png"
                } else if (player.hit === 3) {
                    player.image.src = "./img/Player/Foozle_2DS0011_Void_MainShip/Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Bases/PNGs/Main Ship - Base - Very damaged.png"
                } else {
                    endGame()
                }
            }, 0)
            createParticles({
                object: player,  
                color: particleColorPlayer,
            })
            audio.playerHit.play()
        }
    })

    // --- player projectile rendering + cleanup ---
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i]

        for (let j = bombs.length - 1; j >= 0; j--) {
            const bomb = bombs[j]

            // if projectile touches bomb, remove projectile
            if (
                Math.hypot(
                    projectile.position.x - bomb.position.x, 
                    projectile.position.y - bomb.position.y
                ) < 
                projectile.radius + bomb.radius && !bomb.active
            ) {
                projectiles.splice(i, 1)
                bomb.explode()
            }
        }

        if (projectile.position.y + projectile.radius <= 0) {
                projectiles.splice(i, 1)
        } else {
            projectile.update()
        }

        for (let j = powerUps.length - 1; j >= 0; j--) {
            const powerUp = powerUps[j]

            // if projectile touches power-up, remove projectile
            if (
                Math.hypot(
                    projectile.position.x - powerUp.position.x, 
                    projectile.position.y - powerUp.position.y
                ) < 
                projectile.radius + powerUp.radius
            ) {
                audio.powerUp.play()
                score += 13
                scoreEl.innerHTML = score
                createScoreLabel({
                    score: 13,
                    object: player,
                    offset: {
                        x: 0,
                        y: 0
                    }
                })
                createParticles({
                    object: player,
                    color: "#ffd300"
                })
                projectiles.splice(i, 1)
                powerUps.splice(j, 1)
                player.powerUp = "MachineGun"
                setTimeout(() => {
                    player.powerUp = null
                }, 7000)
            }
        }
    }


    grids.forEach((grid, gridIndex) => {
        grid.update()

        // --- spawn projectiles ---
        if (frames % 100 === 0
            && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.
                length)].shoot(
                    invaderProjectiles
                )
        }

        for (let i = grid.invaders.length - 1; i >= 0; i--) {
            const invader = grid.invaders[i]
        
            invader.update({velocity: grid.velocity})

            for (let j = bombs.length - 1; j >= 0; j--) {
                const bomb = bombs[j]

                invaderRadius = 25

                // if bomb touches invader, remove invader
                if (
                    Math.hypot(
                        invader.position.x - bomb.position.x, 
                        invader.position.y - bomb.position.y
                    ) < 
                    invaderRadius + bomb.radius && bomb.active
                ) {
                    score += 10
                    scoreEl.innerHTML = score
                    grid.invaders.splice(i, 1)
                    createScoreLabel({
                        score: 10,
                        object: invader,
                        offset: {
                            x: 0,
                            y: 0
                        }
                    })

                    createParticles({
                        object: invader,
                        color: particleColorInvader,
                    })
                }
            }

            //--- player projectile hits enemy ---
            projectiles.forEach((projectile, j) => {
                if (
                    projectile.position.y - projectile.radius <=
                    invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >= 
                    invader.position.x && 
                    projectile.position.x - projectile.radius <=
                    invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >=
                    invader.position.y
                ) {
                        setTimeout(() => {
                            const invaderFound = grid.invaders.find((invader2) => {
                                return invader2 === invader
                            })
                            const projectileFound = projectiles.find((projectile2) => {
                                return projectile2 === projectile
                            })

                            // --- Remove Invaders and Projectiles---
                            if (invaderFound && projectileFound) {
                                audio.enemyHit.play()

                                score += 10
                                scoreEl.innerHTML = score

                                // --- dynamic score labels ---
                                createScoreLabel({ 
                                    score: 10,
                                    object: invader,
                                    offset: {
                                        x: 0,
                                        y: 0
                                    }
                                })
                                

                                createParticles({
                                    object: invader,
                                    color: particleColorInvader,
                                })

                                grid.invaders.splice(i, 1)
                                projectiles.splice(j, 1)

                                if (grid.invaders.length > 0) {
                                    const firstInvader = grid.invaders[0]
                                    const lastInvader = grid.invaders[grid.invaders.length - 1]

                                    grid.width = 
                                        lastInvader.position.x - 
                                        firstInvader.position.x + lastInvader.width
                                    grid.position.x = firstInvader.position.x
                                } else {
                                    score += 7
                                    scoreEl.innerHTML = score
                                    createScoreLabel({
                                        score: 7,
                                        object: invader,
                                        offset: {
                                            x: -10,
                                            y: 10
                                        }
                                    })
                                    grids.splice(gridIndex, 1)
                                }
                            }
                        }, 0)
                    }
            })

            // remove player if hit by invaders
            if( rectangularCollision({
                rectangle1: invader,
                rectangle2: player
            }) && !game.over) 
            {
                endGame()
            }

        } //  end looping over grid.invaders
    })

    if (keys.a.pressed 
        && player.position.x >= 5) {
        player.velocity.x = -speed
        player.rotation = -rotate
    } else if (keys.d.pressed
                && player.position.x + player.width <= canvas.width) {
        player.velocity.x = speed
        player.rotation = rotate
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }

    // --- spawning enemies ---
    if (frames % randomInterval === 0) {
        spawnInterval = spawnInterval < 0 ? 0 : spawnInterval
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 500 + spawnInterval)
        frames = 0
        spawnInterval -= 50
    }


    frames++
    spawnFrames++
};

addEventListener('click', () => {
    audio.click.play()
});

// --- Call Animate Function ---
document.querySelector("#startButton").addEventListener('click', () => {
    audio.playButton.play()
    audio.backgroundMusic.play()
    document.querySelector("#startScreen").style.display = "none"
    document.querySelector("#scoreContainer").style.display = "block"
    init()
    animate()
});

document.querySelector("#restartButton").addEventListener('click', () => {
    audio.playButton.play()
    document.querySelector("#restartScreen").style.display = "none"
    init()
    score = 0
    scoreEl.innerHTML = score
    animate()
});

document.querySelector("#noButton").addEventListener('click', () => {
    audio.playButton.play()
    audio.backgroundMusic.stop()
    document.querySelector("#restartScreen").style.display = "none"
    document.querySelector("#startScreen").style.display = "flex"
    score = 0
    scoreEl.innerHTML = 0
});

document.querySelector("#musicButton").addEventListener('click', () => {
    if (Howler.volume() > 0) {
        Howler.volume(0)
    } else {
        Howler.volume(0.8)
    }
});

addEventListener("keydown", ({ key }) => {
    if (game.over) return
    
    switch (key) {
        case 'a':
            keys.a.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
        case ' ':
            keys.space.pressed = true
            break
        case 'ArrowLeft':
            keys.a.pressed = true
            break
        case 'ArrowRight' :
            keys.d.pressed = true
            break
    }
});

addEventListener("keyup", ({ key }) => {
    switch (key) {
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case ' ':
            keys.space.pressed = false
            break
        case 'ArrowLeft':
            keys.a.pressed = false
            break
        case 'ArrowRight' :
            keys.d.pressed = false
            break
    }
});