(function () {

    // 玩偶初始所在xy轴以及在第几个格子
    let x = 240  
    let y = 240
    let currentLocation = 13 

    // 四个怪物初始所在xy轴以及在第几个格子
    let monstersXY = [
        {
            x: 0,
            y: 0,
            currentLocation: 1
        },
        {
            x: 480,
            y: 0,
            currentLocation: 5
        },
        {
            x: 0,
            y: 480,
            currentLocation: 21
        },
        {
            x: 480,
            y: 480,
            currentLocation: 25
        }
    ]
    const initMonsterXy = deepClone(monstersXY) 

    const grids = [     // 存储每个格子的位置
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

    let timer = null
    let passLevelTimer = null 
    let dountDown = 1000 // 怪物速度
    let playType = 1  // 1: 游戏未开始 2: 游戏进行中 3: 暂停游戏 4: 游戏结束

    const playGame = document.querySelector('.play-game')
    const playGameIcon = document.querySelector('.play-game-icon')
    const playGameText = document.querySelector('.play-game-text')
    const lovelyEl = document.querySelector('.lovely-gif')
    const monstersEl = document.querySelectorAll('.monster-gif')
    const levelItems = document.querySelectorAll('.level-item')
    const countTimeEl = document.querySelector('.count-time')

    playGame.addEventListener('click', playGameHandler)
    seletLevel()
    countDownPassLevel()

    function playGameHandler() {
        if (playType === 1 || playType === 4) {
            startGame()
        } else if (playType === 2) {
            pauseGame()
        } else if (playType === 3) {
            continueGame()
        }
    }

    function initGame(flag) {   // 游戏初始化  flag=> true: 选择关卡 false: 游戏失败
        clearInterval(timer)
        document.removeEventListener('keydown', keyDownHandler)
        x = 240
        y = 240
        currentLocation = 13
        monstersXY = deepClone(initMonsterXy)
        if(flag) {
            playType = 1
            playGameText.textContent = '开始游戏'
            playGameIcon.src = './imgs/icon/play.png'
            lovelyEl.style.transform = `translateX(${x}px) translateY(${y}px)`
            monstersXY.forEach((item, index) => monstersEl[index].style.transform = `translateX(${item.x}px) translateY(${item.y}px)`)
        }else {
            playType = 4
            playGameText.textContent = '重新开始'
            playGameIcon.src = './imgs/icon/refresh.png'
            setTimeout(() => {
                alert('游戏失败！')
                lovelyEl.style.transform = `translateX(${x}px) translateY(${y}px)`
                monstersXY.forEach((item, index) => monstersEl[index].style.transform = `translateX(${item.x}px) translateY(${item.y}px)`)
            }, 1000)
        }
    }

    function startGame() {   // 开始游戏
        playType = 2
        playGameText.textContent = '暂停游戏'
        playGameIcon.src = './imgs/icon/pause.png'
        document.addEventListener('keydown', keyDownHandler)
        timer = setInterval(() => monsterMoveOneSquare(), dountDown)
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
        timer = setInterval(() => monsterMoveOneSquare(), dountDown)
    }

    function sameLocation() {   // 判断玩偶与怪物是否在同一位置 
        for(let i = 0; i < monstersXY.length; i++) {
            if(monstersXY[i].currentLocation === currentLocation) {
                initGame(false)
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
        currentLocation = queryGridLoca(x, y)
        lovelyEl.style.transform = `translateX(${x}px) translateY(${y}px)`
        sameLocation()
    }

    function monsterMoveOneSquare() {   // 四个怪物移动
        monstersXY.forEach((item, index) => {
            const type = randomNumDirection()
            if (type === 1 && item.y != 0) {
                const flag = stopMonsterSameLovation(item.x, item.y - 120)
                if(flag) {
                    return 
                }
                item.y -= 120
            } else if (type === 2 && item.x != 480) {
                const flag = stopMonsterSameLovation(item.x + 120, item.y)
                if(flag) {
                    return
                }
                item.x += 120
            } else if (type === 3 && item.y != 480) {
                const flag = stopMonsterSameLovation(item.x, item.y + 120)
                if(flag) {
                    return
                }
                item.y += 120
            } else if (type === 4 && item.x != 0) {
                const flag = stopMonsterSameLovation(item.x - 120, item.y)
                if(flag) {
                    return
                }
                item.x -= 120
            }
            item.currentLocation = queryGridLoca(item.x, item.y)
            monstersEl[index].style.transform = `translateX(${item.x}px) translateY(${item.y}px)`
        })
        sameLocation()
    }

    function stopMonsterSameLovation(mX, mY) {  // 禁止四个怪物位置重叠
        const tempLoca = queryGridLoca(mX, mY) 
        for(let i = 0; i < monstersXY.length; i++) {
            const { currentLocation } = monstersXY[i]
            if(tempLoca === currentLocation) {
               return true
            }
        }
    }

    function queryGridLoca(x, y) {  // 根据xy轴查询格子
        for(const grid of grids) {
            if(x === grid.x && y === grid.y) {
                return grid.curLocation
            }
        }
    }

    function randomNumDirection() {  // 怪物随机移动参数 1: top 2: right 3: down 4: left
        return Math.floor(Math.random() * 4 + 1)
    }

    function seletLevel() {     // 选择关卡
        levelItems.forEach((item, idx) => {
            item.addEventListener('click', function() {
                dountDown = 1000 - idx * 70
                levelItems.forEach(sItem => sItem.className = 'level-item')
                this.className = 'level-item level-active'
                initGame(true)
            })
        })
    }

    function countDownPassLevel() {  // 倒计时通关
        let count = 45
        passLevelTimer = setInterval(() => {
            if(count === 0) {
                clearInterval(passLevelTimer)
            }else {
                count--
                const temp = count < 10 ? '0' + count : count
                countTimeEl.textContent = temp
            }
        }, 100)
    }

    function deepClone(obj) {   // 深拷贝
        let temp = null
        if(typeof(obj) == 'object' && obj !== null) {
            temp = obj instanceof Array ? [] : {}
            for(let i in obj) {
                temp[i] = deepClone(obj[i])
            }
        }else {
            temp = obj
        }
        return temp
    }
    
})()

