function randomBetween(min, max) {
    return Math.random() * (max - min) + min
};

// --- object to hold details about the gun ---
const gunBase = {
    fireRate : 19,  // in frames (if 60 frames a second 2 would be 30 times a second
    nextShotIn : 0, // count down timer till next shot
    update() {
        if(this.nextShotIn > 0){
            this.nextShotIn -= 1;   
        }
    }, 
    fire(){
        if(this.nextShotIn === 0){
            audio.playerShoot.play()
            // call function to fire a bullet
            this.nextShotIn = this.fireRate;
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y + 20,
                },
                velocity: {
                    x: 0,
                    y: -15
                },
                radius: 4,
                color: "#00ffff"
            }))
        }
    }
};

const machineGun = {
    fireRate : 5,  // in frames (if 60 frames a second 2 would be 30 times a second
    nextShotIn : 0, // count down timer till next shot
    update() {
        if(this.nextShotIn > 0){
            this.nextShotIn -= 1
        }
    }, 
    fire(){
        if(this.nextShotIn === 0){
            audio.playerShoot2.play()

            // call function to fire a bullet
            this.nextShotIn = this.fireRate;
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y + 20,
                },
                velocity: {
                    x: 0,
                    y: -15
                },
                radius: 3,
                color: "#df00ff"
            }))
        }
    }
};

// --- Particle color for stars ---
let particleColorStars = Math.random()
if (particleColorStars < 0.15) {
    particleColorStars = "rgba(255, 255, 255, 0.3)"
} else if (particleColorStars >= 0.15 && particleColorStars < 0.3) {
    particleColorStars = "rgba(255, 255, 255, 0.6)"
} else {
    particleColorStars = "rgba(255, 255, 255, 0.9)"
}

function createParticles({ object, color, fades }) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color,
            fades: true
        })
        )
    }
};

function createScoreLabel({ score, object, offset }) {
    const scoreLabel = document.createElement("label")
        scoreLabel.innerHTML = score
        scoreLabel.style.position = "absolute"
        scoreLabel.style.color = "white"
        scoreLabel.style.top = object.position.y + object.height / 2 + offset.y + 'px'
        scoreLabel.style.left = object.position.x + offset.x + 'px'
        scoreLabel.style.fontFamily = "'Press Start 2P', system-ui"
        scoreLabel.style.fontSize = "10px"
        scoreLabel.style.userSelect = "none"
        document.querySelector("#parentDiv").appendChild(scoreLabel)
        gsap.to(scoreLabel, {
            duration: 1.3,
            ease: "(0.7, 0.7, false)",
            opacity: 0,
            color: "gold",
            y: -30,
            onComplete: () => {
                document.querySelector("#parentDiv").
                removeChild(scoreLabel)
            }
        })
};

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (rectangle1.position.y + rectangle1.height >= rectangle2.position.y
            && rectangle1.position.x + rectangle1.width >= rectangle2.position.x
            && rectangle1.position.x <= rectangle2.position.x + rectangle2.width)
};