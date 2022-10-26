(function () {
    let x = 0
    let y = 0
    let x2 = 0
    let y2 = 0
    let timer = null
    let playType = 1  // 1: 游戏未开始 2: 游戏进行中 3: 暂停游戏 
    let currentLocation = 1
    const monsterCurrentLocations = [25]
    const grids = [
        { x: 0, y: 0, curLocation: 1 },
        { x: 120, y: 0, curLocation: 2 },
        { x: 240, y: 0, curLocation: 3 },
        { x: 360, y: 0, curLocation: 4 },
        { x: 480, y: 0, curLocation: 5 },
        { x: 0, y: 120, curLocation: 6 },
        { x: 120, y: 120, curLocation: 7 },
        { x: 240, Y: 120, curLocation: 8 },
        { x: 360, y: 120, curLocation: 9 },
        { x: 480, y: 120, curLocation: 10 },
        { x: 0, y: 240, curLocation: 11 },
        { x: 120, y: 240, curLocation: 12 },
        { x: 240, y: 240, curLocation: 13 },
        { x: 360, y: 240, curLocation: 14 },
        { x: 480, y: 240, curLocation: 15 },
        { x: 0, y: 360, curLocation: 16 },
        { x: 120, y: 360, curLocation: 17 },
        { x: 240, y: 360, curLocation: 18 },
        { x: 360, y: 360, curLocation: 19 },
        { x: 480, y: 360, curLocation: 20 },
        { x: 0, y: 480, curLocation: 21 },
        { x: 120, y: 480, curLocation: 22 },
        { x: 240, y: 480, curLocation: 23 },
        { x: 360, y: 480, curLocation: 24 },
        { x: 480, y: 480, curLocation: 25 }
    ]
    const playGame = document.querySelector('.play-game')
    const playGameIcon = document.querySelector('.play-game-icon')
    const playGameText = document.querySelector('.play-game-text')
    const lovelyEl = document.querySelector('.lovely-gif')
    const monsterEl = document.querySelector('.monster-gif')

    initGameHandler()


    function initGameHandler() {
        playGame.addEventListener('click', playGameHandler)
    }

    function playGameHandler() {
        if (playType === 1) {
            startGame()
        } else if (playType === 2) {
            pauseGame()
        } else if (playType === 3) {
            continueGame()
        }
    }

    function startGame() {   // 开始游戏
        playType = 2
        playGameText.textContent = '暂停游戏'
        playGameIcon.src = './imgs/icon/pause.png'
        document.addEventListener('keydown', keyDownHandler)
        timer = setInterval(() => monsterMoveOneSquare(), 500)
    }

    function pauseGame() {   // 暂停游戏
        playType = 3
        playGameText.textContent = '继续游戏'
        playGameIcon.src = './imgs/icon/play.png'
        document.removeEventListener('keydown', keyDownHandler)
        clearInterval(timer)
    }

    function continueGame() {  // 继续游戏
        playType = 2
        playGameText.textContent = '暂停游戏'
        playGameIcon.src = './imgs/icon/pause.png'
        document.addEventListener('keydown', keyDownHandler)
        timer = setInterval(() => {
            monsterMoveOneSquare()
        }, 500)
    }

    function keyDownHandler(e) {  // 键盘事件
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
    }

    function lovelyMoveOneSquare(type) { // 玩偶移动  1: top 2: right 3: down 4: left
        if (type === 1 && y != 0) {
            y -= 120
        } else if (type === 2 && x != 480) {
            x += 120
        } else if (type === 3 && y != 480) {
            y += 120
        } else if (type === 4 && x != 0) {
            x -= 120
        }
        for (const item of grids) {
            if (x === item.x && y === item.y) {
                currentLocation = item.curLocation
                break
            }
        }
        lovelyEl.style.transform = `translateX(${x}px) translateY(${y}px)`
    }

    function monsterMoveOneSquare() {   // 怪物移动
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
        for (const item of grids) {
            if (x2 === item.x && y2 === item.y) {
                monsterCurrentLocations[0] = item.curLocation
                break
            }
        }
        monsterEl.style.transform = `translateX(${x2}px) translateY(${y2}px)`
    }

    function randomNumDirection() {  // 怪物随机移动参数 1: top 2: right 3: down 4: left
        return Math.floor(Math.random() * 4 + 1)
    }
})()

