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

    let count = 30   // 通关倒计秒数
    let passLevelTimer = null  // 倒计时定时器
    let timer = null  // 怪物定时器
    let keyArrs = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']
    let dountDown = 1000 // 怪物速度
    let playType = 1  // 1: 游戏未开始 2: 游戏进行中 3: 暂停游戏 4: 游戏结束
    let levelIdx = 1  // 当前关卡
    const passLevelIdxs = []   // 保存已经通过的关卡

    const playGameIcon = document.querySelector('.play-game-icon')
    const playGameText = document.querySelector('.play-game-text')
    const lovelyEl = document.querySelector('.lovely-gif')
    const monstersEl = document.querySelectorAll('.monster-gif')
    const countTimeEl = document.querySelector('.count-time')    
    const maskContainer = document.querySelector('.mask-container')

    basePageMethods()
    setHandModule()
    musicControls()
    backgroundImg()

    function basePageMethods() {
        const playGame = document.querySelector('.play-game')
        const cancelBtn = document.querySelector('.cancel')
        const restartBtn = document.querySelector('.restart')
        const nextBtn = document.querySelector('.next')
        const prevBtn = document.querySelector('.prev')
        const levelItems = document.querySelectorAll('.level-item')
        const getPrize = document.querySelector('.get-prize')
        playGame.addEventListener('click', playGameHandler)
        cancelBtn.addEventListener('click', () => maskContainer.style.display = 'none')
        restartBtn.addEventListener('click', function() {
            maskContainer.style.display = 'none'
            playGameHandler()
        })
        prevBtn.addEventListener('click', function() {
            maskContainer.style.display = 'none'
            levelIdx--
            seletLevel()
            playGameHandler()
        })
        nextBtn.addEventListener('click', function() {
            maskContainer.style.display = 'none'
            levelIdx++
            seletLevel()
            playGameHandler()
        })
        getPrize.addEventListener('click', function() {
            if(passLevelIdxs.length === 12) {
                alert('获取成功，在URL地址栏上粘贴链接即可领取。')
            }
        })
        levelItems.forEach((item, idx) => {
            item.addEventListener('click', function() {
                levelIdx = idx + 1
                seletLevel()
            })
        })
    } 

    function playGameHandler() {
        if (playType === 1 || playType === 4) {
            startGame()
        } else if (playType === 2) {
            pauseGame()
        } else if (playType === 3) {
            continueGame()
        }
    }

    function initGame(flag) {   // 游戏初始化  flag=> true: 通关或者选择关卡 false: 游戏失败
        x = 240
        y = 240
        count = 30
        currentLocation = 13
        clearInterval(timer)
        clearInterval(passLevelTimer)
        monstersXY = deepClone(initMonsterXy)
        document.removeEventListener('keydown', keyDownHandler)
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
            gameTips(2)
            setTimeout(() => {
                maskContainer.style.display = 'block'
                countTimeEl.textContent = count
                lovelyEl.style.transform = `translateX(${x}px) translateY(${y}px)`
                monstersXY.forEach((item, index) => monstersEl[index].style.transform = `translateX(${item.x}px) translateY(${item.y}px)`)
            }, 500)
        }
    }
    
    function startGame() {   // 开始游戏
        playType = 2
        playGameText.textContent = '暂停游戏'
        playGameIcon.src = './imgs/icon/pause.png'
        document.addEventListener('keydown', keyDownHandler)
        countDownPassLevel()
        timer = setInterval(() => monsterMoveOneSquare(), dountDown)
    }

    function pauseGame() {   // 暂停游戏
        playType = 3
        playGameText.textContent = '继续游戏'
        playGameIcon.src = './imgs/icon/play.png'
        clearInterval(timer)
        clearInterval(passLevelTimer)
        document.removeEventListener('keydown', keyDownHandler)
    }

    function continueGame() {  // 继续游戏
        playType = 2
        playGameText.textContent = '暂停游戏'
        playGameIcon.src = './imgs/icon/pause.png'
        countDownPassLevel()
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
            case keyArrs[0]:
                lovelyMoveOneSquare(1)
                break
            case keyArrs[1]:
                lovelyMoveOneSquare(2)
                break
            case keyArrs[2]:
                lovelyMoveOneSquare(3)
                break
            case keyArrs[3]:
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

    function seletLevel() {  // 选择关卡
        const noNumberEl = document.querySelector('.no-number')
        const levelItems = document.querySelectorAll('.level-item')
        dountDown = 1000 - (levelIdx * 70)
        noNumberEl.textContent = `第${numIsAddZero(levelIdx)}关`
        levelItems.forEach(sItem => sItem.className = 'level-item')
        levelItems[levelIdx - 1].className = 'level-item level-active'
        initGame(true)
    }

    function countDownPassLevel() {  // 倒计时通关
        passLevelTimer = setInterval(() => {
            if(count === 0) {
                savePassLevelIdx()
                initGame(true)
                gameTips(1)
                maskContainer.style.display = 'block'
            }else {
                count--
                countTimeEl.textContent = numIsAddZero(count)
            }
        }, 1000)
    }

    function savePassLevelIdx() {   // 保存通过的关卡
        const flag = passLevelIdxs.some(item => item === levelIdx)
        !flag && passLevelIdxs.push(levelIdx)
        const levelItems = document.querySelectorAll('.level-item')
        const nowPassIcon = levelItems[levelIdx - 1].children[0]
        nowPassIcon.style.display = 'block'
        if(passLevelIdxs.length === 12) {
            const getPrize = document.querySelector('.get-prize')
            getPrize.style.background = '#45b97c'
            getPrize.style.cursor = 'pointer'
        }   
    }

    function gameTips(num) {  // 弹窗提示  num=> 1: 游戏成功  2：游戏失败
        const tipsImg = document.querySelector('.tips-img')
        const tipsText = document.querySelector('.tips-text')
        const prevBtn = document.querySelector('.prev')
        const nextBtn = document.querySelector('.next')
        if(num === 1) {
            tipsImg.src = './imgs/win.jpg'
            tipsText.textContent = '通关成功'
            tipsText.style.color = 'green'
        }
        if(num === 2) {
            tipsImg.src = './imgs/fail.png'
            tipsText.textContent = '通关失败'
            tipsText.style.color = 'red'
        }
        levelIdx === 1 ? prevBtn.style.display = 'none' : prevBtn.style.display = 'block'
        levelIdx === 12 ? nextBtn.style.display = 'none' :  nextBtn.style.display = 'block'
    }

    function musicControls() {   // 游戏声音
        let playFlag = false  // true: 播放 false: 暂停
        const navMusic = document.querySelector('.nav-music')
        const audioEl = document.querySelector('.audio-el')
        const musicImg = document.querySelector('.music-img')
        const musicWidth = document.querySelector('.music-width')
        const sLong = document.querySelector('.s-long')
        const pPer = document.querySelector('.p-per')
        audioEl.volume = 0.3
        navMusic.addEventListener('click', function () {
            playFlag = !playFlag
            if (playFlag) {
                audioEl.play()
                musicImg.src = './imgs/icon/music.png'
            } else {
                audioEl.pause()
                musicImg.src = './imgs/icon/close-music.png'
            }
        })
        musicWidth.addEventListener('click', function(e) {
            const size = e.offsetX + 2
            if(size === 100) {
                audioEl.volume = 1
            }else {
                audioEl.volume =  `${Number('0.' + size)}`
            }
            sLong.style.width = `${size}px`
            pPer.textContent = `${size}%`
        })
    }

    function backgroundImg() {     // 页面背景
        const switchEl = document.querySelector('.switch')
        let flag = false
        let switchNum = 0
        switchEl.addEventListener('click', function() {
            flag = !flag
            if(flag) {
                switchNum++
                this.style.background = '#000'
                document.body.style.backgroundImage = "url('./imgs/hr-bg2.jpg')"
                document.styleSheets[0].insertRule('.switch::after{transform: translateX(22px) !important;}', switchNum)
            }else {
                switchNum++
                this.style.background = '#45b97c'
                document.styleSheets[0].insertRule('.switch::after{transform: translateX(2px) !important;}',  switchNum)
                document.body.style.backgroundImage = "url('./imgs/hr-bg.jpg')"
            }
        })
    }
    
    function setHandModule() {  // 按键模式
        let flag = false
        const rightHand = document.querySelector('.set-hand .right-hand')
        const hand = document.querySelector('.set-hand .hand')
        const rightIcon = document.querySelector('.set-hand .right-icon')
        rightHand.addEventListener('click', function() {
            flag = !flag
            if(flag) {
                hand.textContent = '左手'
                rightIcon.style = 'transform: rotate(-180deg);'
                keyArrs = ['w', 'd', 's', 'a']
            }else {
                hand.textContent = '右手'
                rightIcon.style = 'transform: rotate(0);'
                keyArrs = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']
            }
        })
    }

    function numIsAddZero(num) {   // 两位数补零
        return num < 10 ? '0' + num : num
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

    function hasClass(el, classStr) {  // 查询元素是否包含某个类
        return el.classList.contains(classStr)
    }

})()

