import { utils } from './utils'
export function initProperty(player, videoEle) {
    [
        'autoplay',
        'controls',
        'paused',
        'loop',
        'ended',
        'duration',
        'currentTime',
        'playbackRate',
        'volume',
        'muted',
        'error',
        'src'
    ].forEach(property => {
        Object.defineProperty(player, property, {
            get() {
                return videoEle[property]
            },
            set() {
                throw `${property} is readOnly`
            }
        })
    });
    Object.defineProperty(player, 'progress', {
        get() {
            return (player.currentTime / player.duration).toFixed(4).slice(0, 6)
        },
        set() {
            throw `progress is readOnly`
        }
    })
    Object.defineProperty(player, 'formatTime', {
        get() {
            return utils.formatTime(player.currentTime, player.duration)
        },
        set() {
            throw `formatTime is readOnly`
        }
    })
    Object.defineProperty(player, 'audioTracksList', {
        get() {
            return player.getTracksFor('audio')
        },
        set() {
            throw `audioTracksList is readOnly`
        }
    })
    Object.defineProperty(player, 'textTracksList', {
        get() {
            return player.getTracksFor('text')
        },
        set() {
            throw `textTracksList is readOnly`
        }
    })
    Object.defineProperty(player, 'videoTracksList', {
        get() {
            return player.getTracksFor('video')
        },
        set() {
            throw `videoTracksList is readOnly`
        }
    })
    Object.defineProperty(player, 'pictureinpicture', {
        get() {
            return player.globalVariable.pictureinpicture
        },
        set() {
            throw `pictureinpicture is readOnly`
        }
    })
    Object.defineProperty(player, 'Mini', {
        get() {
            return player.globalVariable.hasMini
        },
        set() {
            throw `hasMini is readOnly`
        }
    })
    Object.defineProperty(player, 'fullScreen', {
        get() {
            return player.globalVariable.fullScreen
        },
        set() {
            throw `hasMini is readOnly`
        }
    })
}