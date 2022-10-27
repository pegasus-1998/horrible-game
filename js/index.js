(function () {
    let x = 240
    let y = 240
    let m_x1 = 480
    let m_y1 = 480
    let timer = null
    let playType = 1  // 1: 游戏未开始 2: 游戏进行中 3: 暂停游戏 4: 游戏结束
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
        { x: 240, y: 120, curLocation: 8 },
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
        }else if(playType === 4) {
            startGame()
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
        clearInterval(timer)
        document.removeEventListener('keydown', keyDownHandler)
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

    function overGame() {   // 结束游戏
        playType = 4
        playGameText.textContent = '重新开始'
        playGameIcon.src = './imgs/icon/refresh.png'
        clearInterval(timer)
        document.removeEventListener('keydown', keyDownHandler)
        setTimeout(() => {
            alert('游戏失败！')
            x = 240
            y = 240
            m_x1 = 480
            m_y1 = 480
            currentLocation = 1
            monsterCurrentLocations[0] = 25
            lovelyEl.style.transform = `translateX(${x}px) translateY(${y}px)`
            monsterEl.style.transform = `translateX(${m_x1}px) translateY(${m_y1}px)`
        }, 1000)
    }

    function sameLocation() {   // 判断玩偶与怪物是否在同一位置 
        for(let i = 0; i < monsterCurrentLocations.length; i++) {
            if(monsterCurrentLocations[i] === currentLocation) {
                overGame()
            }
        }
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
        sameLocation()
    }

    function monsterMoveOneSquare() {   // 怪物移动
        const type = randomNumDirection()
        if (type === 1 && m_y1 != 0) {
            m_y1 -= 120
        } else if (type === 2 && m_x1 != 480) {
            m_x1 += 120
        } else if (type === 3 && m_y1 != 480) {
            m_y1 += 120
        } else if (type === 4 && m_x1 != 0) {
            m_x1 -= 120
        }
        for (const item of grids) {
            if (m_x1 === item.x && m_y1 === item.y) {
                monsterCurrentLocations[0] = item.curLocation
                break
            }
        }
        monsterEl.style.transform = `translateX(${m_x1}px) translateY(${m_y1}px)`
        sameLocation()
    }

    function randomNumDirection() {  // 怪物随机移动参数 1: top 2: right 3: down 4: left
        return Math.floor(Math.random() * 4 + 1)
    }
})()

