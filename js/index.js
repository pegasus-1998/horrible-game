let x = 240
let y = 240
let currentLocation = 13

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

let count = 30
let passLevelTimer = null
let timer = null
let keyArrs = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']
let dountDown = 1000
let playType = 1
let levelIdx = 1
let lanFlag = false
const passLevelIdxs = []

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
changeLanguage()
languageStr(false)

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
    restartBtn.addEventListener('click', function () {
        maskContainer.style.display = 'none'
        playGameHandler()
    })
    prevBtn.addEventListener('click', function () {
        maskContainer.style.display = 'none'
        levelIdx--
        seletLevel()
        playGameHandler()
    })
    nextBtn.addEventListener('click', function () {
        maskContainer.style.display = 'none'
        levelIdx++
        seletLevel()
        playGameHandler()
    })
    getPrize.addEventListener('click', function () {
        if (passLevelIdxs.length === 12) {
            copyJL()
            const str = lanFlag ? '获取成功，在URL地址栏上粘贴链接即可领取。' : 'You can get it by pasting it on the URL address bar.'
            alert(`${str}`)
        }
    })
    levelItems.forEach((item, idx) => {
        item.addEventListener('click', function () {
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

function initGame(flag) {
    x = 240
    y = 240
    count = 30
    currentLocation = 13
    clearInterval(timer)
    clearInterval(passLevelTimer)
    monstersXY = deepClone(initMonsterXy)
    document.removeEventListener('keydown', keyDownHandler)
    if (flag) {
        playType = 1
        playGameText.textContent = lanFlag ? '开始游戏' : 'start game'
        playGameIcon.src = './imgs/icon/play.png'
        lovelyEl.style.transform = `translateX(${x}px) translateY(${y}px)`
        monstersXY.forEach((item, index) => monstersEl[index].style.transform = `translateX(${item.x}px) translateY(${item.y}px)`)
    } else {
        playType = 4
        playGameText.textContent = lanFlag ? '重新开始' : 'restart'
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

function startGame() {
    playType = 2
    playGameText.textContent = lanFlag ? '暂停游戏' : 'pause game'
    playGameIcon.src = './imgs/icon/pause.png'
    document.addEventListener('keydown', keyDownHandler)
    countDownPassLevel()
    timer = setInterval(() => monsterMoveOneSquare(), dountDown)
}

function pauseGame() {
    playType = 3
    playGameText.textContent = lanFlag ? '继续游戏' : 'Continue game'
    playGameIcon.src = './imgs/icon/play.png'
    clearInterval(timer)
    clearInterval(passLevelTimer)
    document.removeEventListener('keydown', keyDownHandler)
}

function continueGame() {
    playType = 2
    playGameText.textContent = lanFlag ? '暂停游戏' : 'pause game'
    playGameIcon.src = './imgs/icon/pause.png'
    countDownPassLevel()
    document.addEventListener('keydown', keyDownHandler)
    timer = setInterval(() => monsterMoveOneSquare(), dountDown)
}

function sameLocation() {
    for (let i = 0; i < monstersXY.length; i++) {
        if (monstersXY[i].currentLocation === currentLocation) {
            initGame(false)
        }
    }
}

function keyDownHandler(e) {
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

function lovelyMoveOneSquare(type) {
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

function monsterMoveOneSquare() {
    monstersXY.forEach((item, index) => {
        const type = randomNumDirection()
        if (type === 1 && item.y != 0) {
            const flag = stopMonsterSameLovation(item.x, item.y - 120)
            if (flag) {
                return
            }
            item.y -= 120
        } else if (type === 2 && item.x != 480) {
            const flag = stopMonsterSameLovation(item.x + 120, item.y)
            if (flag) {
                return
            }
            item.x += 120
        } else if (type === 3 && item.y != 480) {
            const flag = stopMonsterSameLovation(item.x, item.y + 120)
            if (flag) {
                return
            }
            item.y += 120
        } else if (type === 4 && item.x != 0) {
            const flag = stopMonsterSameLovation(item.x - 120, item.y)
            if (flag) {
                return
            }
            item.x -= 120
        }
        item.currentLocation = queryGridLoca(item.x, item.y)
        monstersEl[index].style.transform = `translateX(${item.x}px) translateY(${item.y}px)`
    })
    sameLocation()
}

function stopMonsterSameLovation(mX, mY) {
    const tempLoca = queryGridLoca(mX, mY)
    for (let i = 0; i < monstersXY.length; i++) {
        const { currentLocation } = monstersXY[i]
        if (tempLoca === currentLocation) {
            return true
        }
    }
}

function queryGridLoca(x, y) {
    for (const grid of grids) {
        if (x === grid.x && y === grid.y) {
            return grid.curLocation
        }
    }
}

function randomNumDirection() {
    return Math.floor(Math.random() * 4 + 1)
}

function seletLevel() {
    const noNumberEl = document.querySelector('.no-number')
    const levelItems = document.querySelectorAll('.level-item')
    dountDown = 1000 - (levelIdx * 70)
    noNumberEl.textContent = `NO.${numIsAddZero(levelIdx)}`
    levelItems.forEach(sItem => sItem.className = 'level-item')
    levelItems[levelIdx - 1].className = 'level-item level-active'
    initGame(true)
}

function countDownPassLevel() {
    passLevelTimer = setInterval(() => {
        if (count === 0) {
            savePassLevelIdx()
            initGame(true)
            gameTips(1)
            maskContainer.style.display = 'block'
        } else {
            count--
            countTimeEl.textContent = numIsAddZero(count)
        }
    }, 1000)
}

function savePassLevelIdx() {
    const flag = passLevelIdxs.some(item => item === levelIdx)
    !flag && passLevelIdxs.push(levelIdx)
    const levelItems = document.querySelectorAll('.level-item')
    const nowPassIcon = levelItems[levelIdx - 1].children[0]
    nowPassIcon.style.display = 'block'
    if (passLevelIdxs.length === 12) {
        const getPrize = document.querySelector('.get-prize')
        getPrize.style.background = '#45b97c'
        getPrize.style.cursor = 'pointer'
    }
}

function gameTips(num) {
    const tipsImg = document.querySelector('.tips-img')
    const tipsText = document.querySelector('.tips-text')
    const prevBtn = document.querySelector('.prev')
    const nextBtn = document.querySelector('.next')
    if (num === 1) {
        tipsImg.src = './imgs/win.jpg'
        tipsText.textContent = lanFlag ? '通关成功' : 'success'
        tipsText.style.color = 'green'
    }
    if (num === 2) {
        tipsImg.src = './imgs/fail.png'
        tipsText.textContent = lanFlag ? '通关失败' : 'fail'
        tipsText.style.color = 'red'
    }
    levelIdx === 1 ? prevBtn.style.display = 'none' : prevBtn.style.display = 'block'
    levelIdx === 12 ? nextBtn.style.display = 'none' : nextBtn.style.display = 'block'
}

function musicControls() {
    let playFlag = false 
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
    musicWidth.addEventListener('click', function (e) {
        const size = e.offsetX + 2
        if (size === 100) {
            audioEl.volume = 1
        } else {
            audioEl.volume = `${Number('0.' + size)}`
        }
        sLong.style.width = `${size}px`
        pPer.textContent = `${size}%`
    })
}

function backgroundImg() {
    const switchEl = document.querySelector('.switch')
    const swCircle = document.querySelector('.sw-cricle')
    let flag = false
    switchEl.addEventListener('click', function () {
        flag = !flag
        if (flag) {
            this.style.background = '#000'
            swCircle.style.transform = 'translateX(22px)'
            document.body.style.backgroundImage = "url('./imgs/hr-bg2.jpg')"
        } else {
            this.style.background = '#45b97c'
            swCircle.style.transform = 'translateX(2px)'
            document.body.style.backgroundImage = "url('./imgs/hr-bg.jpg')"
        }
    })
}

function setHandModule() {
    let flag = false
    const rightHand = document.querySelector('.set-hand .right-hand')
    const hand = document.querySelector('.set-hand .hand')
    const rightIcon = document.querySelector('.set-hand .right-icon')
    rightHand.addEventListener('click', function () {
        flag = !flag
        if (flag) {
            hand.textContent = lanFlag ? '左手' : 'left hand'
            rightIcon.style = 'transform: rotate(-180deg);'
            keyArrs = ['w', 'd', 's', 'a']
        } else {
            hand.textContent = lanFlag ? '右手' : 'right hand'
            rightIcon.style = 'transform: rotate(0);'
            keyArrs = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']
        }
    })
}

function changeLanguage() {
    const switchLanEl = document.querySelector('.switch-lan')
    const swCricleLan = document.querySelector('.sw-cricle-lan')
    switchLanEl.addEventListener('click', function () {
        lanFlag = !lanFlag
        languageStr()
        if (lanFlag) swCricleLan.style.transform = 'translateX(0)'
        else swCricleLan.style.transform = 'translateX(60px)'
    })
}

function languageStr() {
    const selectLevelText = document.querySelector('.select-level-text')
    const introduceText = document.querySelector('.introduce-text')
    const musicText = document.querySelector('.music-text')
    const setText = document.querySelector('.set-text')
    const backgroundText = document.querySelector('.background-text')
    const musicSize = document.querySelector('.music-size')
    const playGameText = document.querySelector('.play-game-text')
    const intP = document.querySelector('.int-p')
    const getPrize = document.querySelector('.get-prize')
    const keyModuleText = document.querySelector('.key-module-text')
    const hand = document.querySelector('.hand')
    const notes = document.querySelector('.notes')
    const topsContext = document.querySelector('.tops-context')
    const cancel = document.querySelector('.cancel')
    const restart = document.querySelector('.restart')
    const prev = document.querySelector('.prev')
    const next = document.querySelector('.next')
    selectLevelText.textContent = lanFlag ? '选择关卡' : 'select level'
    introduceText.textContent = lanFlag ? '玩法介绍' : 'introduction'
    musicText.textContent = lanFlag ? '声音' : 'music'
    setText.textContent = lanFlag ? '设置' : 'set up'
    backgroundText.textContent = lanFlag ? '背景' : 'BG'
    musicSize.textContent = lanFlag ? '音量' : 'volume'
    playGameText.textContent = lanFlag ? '开始游戏' : 'start game'
    intP.textContent = lanFlag ? '通过键盘的上下左右(或wasd)键操控玩偶，在规定的时间内躲避四个怪物的追捕。通过所有关卡后可领取奖品！' : 'Use the up, down, left and right (or wasd) keys on the keyboard to control the doll and avoid the pursuit of four monsters within the specified time. You can get prizes after passing all levels!'
    getPrize.textContent = lanFlag ? '领取奖品' : 'Receive prizes'
    keyModuleText.textContent = lanFlag ? '按键模式' : 'Key press mode'
    hand.textContent = lanFlag ? '右手' : 'right hand'
    cancel.textContent = lanFlag ? '取消' : 'cancel'
    restart.textContent = lanFlag ? '重新开始' : 'restart'
    prev.textContent = lanFlag ? '上一关' : 'front level'
    next.textContent = lanFlag ? '下一关' : 'next level'
    notes.textContent = lanFlag ? '提示：左手模式控制wasd键，右手模式控制上下左右键。' : 'Tip: The left hand mode controls the wasd key, and the right hand mode controls the up, down, left and right keys.'
    topsContext.textContent = lanFlag ? '提示：通过所有关卡后可在玩法介绍中领取奖品。' : 'Tip: After passing all levels, you can receive prizes in the game introduction.'
}

function copyJL() {
    const JL = 'http://pgs98.com/horrible-game/imgs/JL.jpg'
    if (navigator.clipboard) {
        navigator.clipboard.writeText(JL)
        return
    }
    const copyInput = document.createElement('input')
    copyInput.style.position = 'fixed'
    copyInput.style.left = '-100%'
    copyInput.style.top = '0'
    copyInput.style.zIndex = -100
    copyInput.style.opacity = 0
    document.body.appendChild(copyInput)
    copyInput.value = JL
    copyInput.focus()
    copyInput.select()
    document.execCommand('copy')
    document.body.removeChild(copyInput)
}

function numIsAddZero(num) {
    return num < 10 ? '0' + num : num
}

function deepClone(obj) {
    let temp = null
    if (typeof (obj) == 'object' && obj !== null) {
        temp = obj instanceof Array ? [] : {}
        for (let i in obj) {
            temp[i] = deepClone(obj[i])
        }
    } else {
        temp = obj
    }
    return temp
}

function hasClass(el, classStr) {
    return el.classList.contains(classStr)
}