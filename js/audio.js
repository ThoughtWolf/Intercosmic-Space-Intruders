Howler.volume(0.8)

const audio = {
    backgroundMusic: new Howl({
        src: "./audio/music/Pixel Perfect.wav",
        loop: true,
        volume: 0.5
    }),
    bomb: new Howl({
        src: "./audio/sfx/bombBoom.wav"
    }),
    click: new Howl({
        src: "./audio/sfx/click.wav"
    }),
    endGame: new Howl({
        src: "./audio/sfx/endGame.wav",
        volume: 0.6
    }),
    enemyShoot: new Howl({
        src: "./audio/sfx/enemyShoot.wav",
        volume: 0.35
    }),
    playerShoot2: new Howl({
        src: "./audio/sfx/playerShoot.wav",
        volume: 0.1,
        rate: 0.7,
    }),
    playButton: new Howl({
        src: "./audio/sfx/playButton.wav"
    }),
    playerDied: new Howl({
        src: "./audio/sfx/playerDied.wav"
    }),
    playerHit: new Howl({
        src: "./audio/sfx/playerHit.wav"
    }),
    playerShoot: new Howl({
        src: "./audio/sfx/playerShoot.wav",
        volume: 0.2,
        rate: 0.9
    }),
    powerUp: new Howl({
        src: "./audio/sfx/powerUp.wav",
        volume: 0.4
    }),
    enemyHit: new Howl({
        src: "./audio/sfx/enemyHit.wav",
        volume: 0.5,
    })

};