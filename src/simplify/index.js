var dash_min = require('../core/dash/dash.all.min.js')
var initProperty = require('./property')
var initMethods = require('./methods')
var initEvents = require('./events')
var initGlobal = require('./global')

module.exports = function MediaPlayer(options) {
    return init(options)
}
function init(options) {
    var player = Object.create(
        dashjs.MediaPlayer().create()
    )

    var {
        rootEle,
        videoEle,
        autoplay,
        controls,
        loop,
        startTime,
        playbackRate,
        volume,
        src,
        maxBitrate,
        initialBitrate,
        autoQuality,
    }
        = options
        = Object.assign({
            rootEle: '',
            videoEle: '',
            autoplay: true,
            controls: false,
            loop: false,
            startTime: null,
            playbackRate: 1.0,
            volume: 0.5,
            src: '',
            maxBitrate: -1,
            initialBitrate: -1,
            autoQuality: true,
        }, options)

    if (typeof videoEle === 'string') {
        videoEle = document.querySelector(videoEle)
    } else if (typeof videoEle === 'object' && videoEle.nodeName === "VIDEO") {
        videoEle
    } else {
        throw new Error('videoEle will be  id / class,or video element')
        return false
    }
    if (typeof rootEle === 'string') {
        rootEle = document.querySelector(rootEle)
    } else if (typeof rootEle === 'object' && rootEle.nodeName === "VIDEO") {
        rootEle
    } else {
        throw new Error('rootEle will be  id / class,or video element')
        return false
    }
    player.initialize(videoEle, src, false);

    player.videoEle = videoEle;
    player.rootEle = rootEle;

    delete options.maxBitrate
    delete options.initialBitrate
    delete options.autoQuality

    initVideo(videoEle, options)
    initGlobal(player)
    initProperty(player, videoEle)
    initEvents(player)
    initMethods(player)
    initPlayer(player)

    player.updateSettings({
        streaming: {
            scheduleWhilePaused: true,
            fastSwitchEnabled: true,
            stableBufferTime: 1,
            abr: {
                useDefaultABRRules: true,
                maxBitrate: { audio: -1, video: maxBitrate },
                initialBitrate: { audio: -1, video: initialBitrate },
                // Select image quality based on network                  
                autoSwitchBitrate: { audio: true, video: autoQuality }
            }
        }
    })
    return player
}

function initVideo(videoEle, options) {
    Object.assign(videoEle, options)
}

function initPlayer(player) {

    player.once('canPlay', function () {

        player.autoplay ? player.play() : player.pause()
        player.setPlaybackRate(player.playbackRate)
        player.setVolume(player.volume)
        player.loop && player.setLoop(true)
    })

    var cancel = player.listener('playbackNotAllowed', function () {
        setTimeout(() => {
            if (player.autoplay) {
                player.play()
            } else {
                player.pause()
            }
        }, 100);
    })

    player.once('playbackPlaying', function () {
        cancel()
    })

}
