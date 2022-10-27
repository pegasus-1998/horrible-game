(function () {
    musicControls()

    function musicControls() {   // 声音
        let playFlag = false  // true: 播放 false: 暂停
        const navMusic = document.querySelector('.nav-music')
        const audioEl = document.querySelector('.audio-el')
        const musicImg = document.querySelector('.music-img')
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
    }
})()
