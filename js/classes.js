// -- Created Player Class + Characteristics ---
class Player {
    constructor() {
        

        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0
        this.opacity = 1
        this.hit = 0

        // --- Image + Drawing of Player ---
            /* --- use image.onload() to make sure image and player position
                    are rendered after this.image is true --- */
        const image = new Image()
        image.src = "./img/Player/Foozle_2DS0011_Void_MainShip/Foozle_2DS0011_Void_MainShip/Main Ship/Main Ship - Bases/PNGs/Main Ship - Base - Full health.png"
        image.onload = () => {
            const scale = 1.5
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale

            if (this.hit === 0) {
                this.position = {
                    x: canvas.width / 2 - this.width / 2,
                    y: canvas.height - this.height - 20
                }
            } 
        }

        this.particles = []
        this.frames = 0
    }

    // --- Rendering Player ---
    draw() {
        // c.fillStyle = "red"
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        c.save()
        c.globalAlpha = this.opacity
        c.translate(
            player.position.x + player.width / 2, 
            player.position.y + player.height / 2
        )
        c.rotate(this.rotation)
        c.translate(
            -player.position.x - player.width / 2, 
            -player.position.y - player.height / 2
        )

        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y,
            this.width, 
            this.height
        )

        c.restore()
    }

    // --- Updates Player Position and Velocity --
    update() {
        if (!this.image) return 
            
        this.draw()
        this.position.x += this.velocity.x

        this.frames++
        if (this.frames % 2 === 0) {
            this.particles.push(
                new Particle({
                    position: {
                        x: this.position.x + this.width / 2,
                        y: this.position.y + this.height - 20
                    },
                    velocity: {
                        x: (Math.random() - 0.5) * 1.1,
                        y: Math.random() * 1 + 0.5
                    },
                    radius: Math.random() * 3,
                    color: engineParticleColor,
                    fades: true
            }))
        }
    }
};


class Projectile {
    constructor({ position, velocity, radius, color }) {
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        }

    draw() {
        c.beginPath()
        c.arc(this.position.x, 
            this.position.y, 
            this.radius, 0, 
            Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
};

class Particle {
    constructor({ position, velocity, radius, color, fades }) {
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
        }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, 
            this.position.y, 
            this.radius, 0, 
            Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.fades) {
            this.opacity -= 0.01
        }
    }
};

class InvaderProjectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity

        this.width = 4
        this.height = 12
        }

    draw() {
        c.fillStyle = "#ff003f"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
};

class Invader {
    constructor({position}) {
        

        this.velocity = {
            x: 0,
            y: 0
        }

        // --- Image + Drawing of Player ---
            /* --- use image.onload() to make sure image and player position
                    are rendered after this.image is true --- */
        const image = new Image()
        image.src = "./img/Enemies/Foozle_2DS0014_Void_FleetPack_3/Foozle_2DS0014_Void_EnemyFleet_3/Nautolan/Designs - Base/PNGs/Nautolan Ship - Scout - Base.png"
        image.onload = () => {
            const scale = 1.5
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale

            this.position = {
                x: position.x,
                y: position.y
            }
        }

        
    }

    // --- Rendering Player ---
    draw() {
        // c.fillStyle = "red"
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y,
            this.width, 
            this.height
        )

    }

    // --- Updates Player Position and Velocity
    update ({velocity}) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }

    shoot(invaderProjectiles) {
        audio.enemyShoot.play()

        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))
    }
};

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 2,
            y: 0
        }

        this.invaders = []

        const columns = Math.floor(Math.random() * 7 + 7)
        const rows = Math.floor(Math.random() * 5 + 1)

        this.width = columns * 50 + 15
        
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(new Invader({
                    position: {
                        x: x * 50,
                        y: y * 50
                    }
                }))
            }
        }
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width
            || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x * 1.1
            this.velocity.y = 50
        }
    }
};

class Bomb {
    static radius = 30
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 31
        this.color = "red"
        this.opacity = 1
        this.active = false

    const image = new Image()
        image.src = "./img/Misc/Pickups/Bomb2.0.png"    
        image.onload = () => {
            const scale = 0.15
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
        }
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        setTimeout(() => {
            c.drawImage(
                this.image, 
                this.position.x, 
                this.position.y,
                this.width, 
                this.height
            )
        }, 0)
        c.fill()
        c.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.x + this.width + this.velocity.x >= canvas.width
            || this.position.x - this.width + this.velocity.x <= 0
        ) {
            this.velocity.x = -this.velocity.x
        } else if (this.position.y + this.height + this.velocity.y >= canvas.height
            || this.position.y - this.height + this.velocity.y <= 0
        ) {
            this.velocity.y = -this.velocity.y
        }
    }

    explode() {
        audio.bomb.play()

        this.active = true
        
        this.image.src = "./img/Misc/Pickups/Bomb2.0(white).png"

        gsap.to(this, {
            width: 200,
            radius: 180
        })

        gsap.to(this, {
            delay: 0.1,
            opacity: 0,
            duration: 0.2
        })
    }
};

class PowerUpMachineGun {
    constructor({ position, velocity, radius }) {
        this.position = position
        this.velocity = velocity

        this.radius = radius

        const image = new Image()
        image.src = "./img/Misc/Pickups/machinegun2.0.png"    
        image.onload = () => {
            const scale = 0.15
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
        }
    }

    draw() {
        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y,
            this.width, 
            this.height
        )
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
};