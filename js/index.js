let x = 0
let y = 0
let x2 = 0
let y2 = 0
let timer = null
let playType = 1  // 1: 游戏未开始 2: 游戏进行中 3: 暂停游戏 
const playGame = document.querySelector('.play-game')
const playGameIcon = document.querySelector('.play-game-icon')
const playGameText = document.querySelector('.play-game-text')
const lovelyEl = document.querySelector('.lovely-gif')
const monsterEl = document.querySelector('.monster-gif')
initGameHandler()
function initGameHandler() {
    playGame.addEventListener('click', playGameHandler)
    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp':
                lovelyMoveOneSquare(1)
                break
            case 'ArrowRight':
                lovelyMoveOneSquare(2)
                break
            case 'ArrowDown':
                lovelyMoveOneSquare(3)
                break
            case 'ArrowLeft':
                lovelyMoveOneSquare(4)
                break
        }
    })
}

function playGameHandler() {
    if (playType === 1) {
        playType = 2
        playGameText.textContent = '暂停游戏'
        playGameIcon.src = './imgs/icon/pause.png'
        timer = setInterval(() => {
            monsterMoveOneSquare()
        }, 1000)
    }else if(playType === 2) {
        playType = 3
        playGameText.textContent = '继续游戏'
        playGameIcon.src = './imgs/icon/play.png'
        clearInterval(timer)
    }else if(playType === 3) {
        playType = 2
        playGameText.textContent = '暂停游戏'
        playGameIcon.src = './imgs/icon/pause.png'
        timer = setInterval(() => {
            monsterMoveOneSquare()
        }, 1000)
    }
}


function lovelyMoveOneSquare(type) { // 1: top 2: right 3: down 4: left
    if (type === 1 && y != 0) {
        y -= 120
    } else if (type === 2 && x != 480) {
        x += 120
    } else if (type === 3 && y != 480) {
        y += 120
    } else if (type === 4 && x != 0) {
        x -= 120
    }
    lovelyEl.style.transform = `translateX(${x}px) translateY(${y}px)`
}

function monsterMoveOneSquare() {
    const type = randomNumDirection()
    if (type == 1 && y2 != -480) {
        y2 -= 120
    } else if (type == 2 && x2 != 0) {
        x2 += 120
    } else if (type == 3 && y2 != 0) {
        y2 += 120
    } else if (type == 4 && x2 != -480) {
        x2 -= 120
    }
    monsterEl.style.transform = `translateX(${x2}px) translateY(${y2}px)`
}

function randomNumDirection() {  // 1: top 2: right 3: down 4: left
    return Math.floor(Math.random() * 4 + 1)
}

