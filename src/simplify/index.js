// import dash_debug from '../core/dash/dash.all.debug.js'
import dash_min from '../core/dash/dash.all.min.js'
import { initProperty } from './property'
import { initMethods } from './methods'

export function MediaPlayer(options) {
    return init(options)
}
function init(options) {
    var player = Object.create(
        dashjs.MediaPlayer().create()
    )
    player.dashjs = dashjs
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
    } = Object.assign({
        rootEle: '',
        videoEle: '',
        autoplay: true,
        controls: false,
        loop: true,
        startTime: null,
        playbackRate: 1.0,
        volume: 0.5,
        src: '',
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
    player.updateSettings({
        streaming: {
            fastSwitchEnabled: true,
            abr: {
                useDefaultABRRules: false,
            }
        },
    });
    videoEle.controls = controls
    videoEle.autoplay = autoplay
    videoEle.loop = loop
    videoEle.playbackRate = playbackRate
    videoEle.volume = volume;
    player.videoEle = videoEle;
    player.rootEle = rootEle;
    initPlayer(player)
    initProperty(player, videoEle)
    initMethods(player)
    return player
}

function initPlayer(player) {
    var autoplayFn = function () {
        player.autoplay ? player.play() : player.pause()
        player.off('canPlay', autoplayFn)
    }
    player.on('canPlay', autoplayFn)

    var toPlay = function () {
        setTimeout(() => {
            if (player.autoplay) {
                player.play()
            } else {
                player.pause()
            }
        }, 100);
    }
    player.on('playbackNotAllowed', toPlay)
    var playing = function () {
        player.off('playbackNotAllowed', toPlay)
        player.off('playbackPlaying', playing)
    }
    player.on('playbackPlaying', playing)

    player.updateSettings({
        streaming: {
            scheduleWhilePaused: true,
            fastSwitchEnabled: true,
            bufferPruningInterval: 1,
            bufferToKeep: 20,
            bufferAheadToKeep: 80,

            stableBufferTime: 1,
            // bufferTimeAtTopQuality: 0,
            // bufferTimeAtTopQualityLongForm: 5,
            wallclockTimeUpdateInterval: 2000,
        }
    })
}

