import { globalVariable } from './global'
export function initMethods(player) {
    Object.assign(player, {
        // play() { },
        // pause() { },
        // setPlaybackRate() { },
        // setVolume() { }, 
        // setMute(value:boolean) { },
        // use methods from player.__proto__

        forward(time, callback) {
            var disTime = player.currentTime + time
            player.seek(disTime > player.duration ? player.duration : disTime)
            var fn = function () {
                player.off('playbackPlaying', fn)
                typeof callback == "function" && callback()
            }
            player.on('playbackPlaying', fn)
        },
        backUp(time, callback) {
            var disTime = player.currentTime - time
            player.seek(disTime < 0 ? 0 : disTime)
            var fn = function () {
                player.off('playbackPlaying', fn)
                typeof callback == "function" && callback()
            }
            player.on('playbackPlaying', fn)
        },
        setSeek(value, callback) {
            if (!isNaN(value)) {
                player.seek(value)
                var fn = function () {
                    player.off('playbackPlaying', fn)
                    typeof callback == "function" && callback()
                }
                player.on('playbackPlaying', fn)
            } else {
                throw 'params must be number in setSeek'
            }
        },


        getQuality(type) {
            // Type:"video" | "audio" | "text" | "fragmentedText" | "embeddedText" | "image"
            if (!type) {
                var map = {};
                ["video", "audio", "text", "fragmentedText", "embeddedText", "image"].forEach(res => {
                    map[res] = player.getBitrateInfoListFor(res).map(res => ({ ...res }))
                })
                return map
            } else if (type && (type == "video" || type == "audio" || type == "text" || type == "fragmentedText" || type == "embeddedText" || type == "image")) {
                return player.getBitrateInfoListFor(type).map(res => ({ ...res }))
            } else {
                throw 'Type error : "video" | "audio" | "text" | "fragmentedText" | "embeddedText" | "image" '
            }

        },
        setQuality(type, qualityIndex, callback, mode = 'bilibili') {
            // mode  bilibili / youku
            // bilibili ： delay switch (default)
            // youku ： Immediately switch with back up 20s 
            if (type && (type == "video" || type == "audio" || type == "text" || type == "fragmentedText" || type == "embeddedText" || type == "image")) {
                if (isNaN(qualityIndex)) {
                    throw 'setQuality(type, qualityIndex,callback?),  error : qualityIndex:number from  getQuality(type?)'
                } else if (!player.getQuality(type).map(res => res.qualityIndex).includes(qualityIndex)) {
                    throw 'setQuality(type, qualityIndex,callback?),  error : qualityIndex:number must be in getQuality(type)'
                }

                globalVariable.qualityDep[type] = qualityIndex

                // execute quality queue
                clearTimeout(globalVariable.qualityTimeout)
                globalVariable.qualityTimeout = setTimeout(() => {
                    var fn = function () {

                        if (mode == "bilibili") {
                            // cancel last listener
                            typeof globalVariable.qualityChangeFinish == "function" && globalVariable.qualityChangeFinish()
                            globalVariable.qualityChangeFinish = player.once('qualityChangeRendered', function () {
                                typeof callback == 'function' && callback()
                            })
                            return false
                        }
                        var pauseStatus = player.paused
                        player.pause()
                        if (!globalVariable.qualityAfterStartTime) {
                            globalVariable.qualityAfterStartTime = player.currentTime;
                        }
                        if (globalVariable.qualityAfterStartTime - 15 < 0) {
                            player.seek(player.duration - 1)
                        } else if (globalVariable.qualityAfterStartTime + 15 > player.duration) {
                            player.seek(globalVariable.qualityAfterStartTime - 15)
                        } else {
                            player.seek(globalVariable.qualityAfterStartTime - 15)
                        }
                        // player.seek(globalVariable.qualityAfterStartTime)
                        // player.videoEle.currentTime = (globalVariable.qualityAfterStartTime - 20)                        
                        player.once('playbackSeeking', function (e) {
                            console.log('setTimeout')
                            if (globalVariable.qualityAfterStartTime) {
                                console.log('setTimeout if ' + globalVariable.qualityAfterStartTime)

                                player.seek(globalVariable.qualityAfterStartTime)

                                globalVariable.qualityAfterStartTime = null
                                player.play()
                                pauseStatus && player.pause()

                                typeof globalVariable.qualityChangeFinish == "function" && globalVariable.qualityChangeFinish()
                                globalVariable.qualityChangeFinish = player.once('qualityChangeRendered', function () {
                                    typeof callback == 'function' && callback()
                                })
                            }
                            globalVariable.qualityDep = {}
                        })

                    }

                    player.once('qualityChangeRequested', fn)
                    var qualityDep = globalVariable.qualityDep
                    for (const type in qualityDep) {
                        player.setQualityFor(type, qualityDep[type])
                    }
                }, 100);

            } else {
                throw 'setQuality(type, qualityIndex),  error : type "video" | "audio" | "text" | "fragmentedText" | "embeddedText" | "image" '
            }
        },
        // Intelligent selection of image quality
        autoQuality() {
            player.updateSettings({
                streaming: {
                    metricsMaxListDepth: 1000,
                    abandonLoadTimeout: 10000,
                    liveDelayFragmentCount: NaN,
                    liveDelay: null,
                    scheduleWhilePaused: true,
                    fastSwitchEnabled: false,
                    bufferPruningInterval: 10,
                    bufferToKeep: 20,
                    bufferAheadToKeep: 80,
                    jumpGaps: true,
                    smallGapLimit: 1.5,
                    stableBufferTime: 12,
                    bufferTimeAtTopQuality: 30,
                    bufferTimeAtTopQualityLongForm: 60,
                    longFormContentDurationThreshold: 600,
                    wallclockTimeUpdateInterval: 50,
                    lowLatencyEnabled: false,
                    keepProtectionMediaKeys: false,
                    useManifestDateHeaderTimeSource: true,
                    useSuggestedPresentationDelay: true,
                    useAppendWindowEnd: true,
                    manifestUpdateRetryInterval: 100,
                    liveCatchUpMinDrift: 0.02,
                    liveCatchUpMaxDrift: 0,
                    liveCatchUpPlaybackRate: 0.5,
                    lastBitrateCachingInfo: { enabled: true, ttl: 360000 },
                    lastMediaSettingsCachingInfo: { enabled: true, ttl: 360000 },
                    cacheLoadThresholds: { video: 50, audio: 5 },
                    retryIntervals: {
                        MPD: 500,
                        XLinkExpansion: 500,
                        InitializationSegment: 1000,
                        IndexSegment: 1000,
                        MediaSegment: 1000,
                        BitstreamSwitchingSegment: 1000,
                        other: 1000,
                        lowLatencyReductionFactor: 10
                    },
                    retryAttempts: {
                        MPD: 3,
                        XLinkExpansion: 1,
                        InitializationSegment: 3,
                        IndexSegment: 3,
                        MediaSegment: 3,
                        BitstreamSwitchingSegment: 3,
                        other: 3,
                        lowLatencyMultiplyFactor: 5
                    },
                    abr: {
                        bandwidthSafetyFactor: 0.9,
                        useDefaultABRRules: true,
                        useBufferOccupancyABR: false,
                        useDeadTimeLatency: true,
                        limitBitrateByPortal: false,
                        usePixelRatioInLimitBitrateByPortal: false,
                        maxBitrate: { audio: -1, video: -1 },
                        minBitrate: { audio: -1, video: -1 },
                        maxRepresentationRatio: { audio: 1, video: 1 },
                        initialBitrate: { audio: -1, video: -1 },
                        initialRepresentationRatio: { audio: -1, video: -1 },
                        autoSwitchBitrate: { audio: true, video: true }
                    },
                    cmcd: {
                        enabled: false,
                        sid: null,
                        cid: null,
                        did: null
                    }
                }
            });
        },

        switchPictureInPicture(tip) {
            var videoElement = player.videoEle
            if ('pictureInPictureEnabled' in document) {
                if (videoElement !== document.pictureInPictureElement) {
                    videoElement.requestPictureInPicture();
                    return globalVariable.pictureinpicture = true
                } else {
                    // exit
                    document.exitPictureInPicture();
                    return globalVariable.pictureinpicture = false
                }
            } else {
                tip = tip || 'The current browser does not support picture in picture. Please try using another browser'
                alert(tip)
                throw (tip)
            }

        },

        switchMiniMode(size, position) {
            // Small screen mode
            var lastCanvas = player.rootEle.querySelector("#CJ-canvas-screen")
            if (lastCanvas && lastCanvas.nodeName == "CANVAS") {
                player.rootEle.removeChild(lastCanvas)
                globalVariable.hasMini = false
                return false
            }
            if (typeof size !== 'object') {
                throw 'param:size will be Object'
            }
            if (!size.width && !size.height) {
                throw 'param:size must have property width or height'
            }
            if (typeof position !== 'object') {
                throw 'param:position will be Object'
            }
            if (!position.top && !position.left && !position.right && !position.bottom) {
                throw 'param:position must have property top-left or top-right or bottom-left or bottom-right'
            }
            var videoEle = player.videoEle
            var _canvas = document.createElement('canvas')
            _canvas.id = "CJ-canvas-screen"
            if (size.width && size.height) {
                _canvas.width = size.width
                _canvas.height = size.height

            } else if (size.width) {
                _canvas.width = size.width
                _canvas.height = size.width / videoEle.offsetWidth * videoEle.offsetHeight
            } else if (size.height) {
                _canvas.width = size.height / videoEle.offsetHeight * videoEle.offsetWidth
                _canvas.height = size.height
            }
            Object.assign(_canvas.style, {
                position: 'fixed',
                top: position.top + "px",
                left: position.left + "px",
                bottom: position.bottom + "px",
                right: position.right + "px",
                transform: 'translate(0, 0)',
                'z-index': 9999
            })
            var context = _canvas.getContext("2d");
            switchToCanvas();
            function switchToCanvas() {
                if (videoEle.ended) {
                    return;
                }
                // 将videoEle上的图片的每一帧以图片的形式绘制的canvas上
                context.drawImage(videoEle, 0, 0, _canvas.width, _canvas.height);

                window.requestAnimationFrame(switchToCanvas);
            }
            var moveX = 0,
                moveY = 0,
                lastMoveX = 0,
                lastMoveY = 0,
                distanceX = 0,
                distanceY = 0;
            var flag = false;
            var [translateX, translateY] = [0, 0];
            var [clientWidth, clientHeight] = [0, 0];
            var [positionX, positionY] = [_canvas.offsetLeft, _canvas.offsetTop];

            _canvas.onmousedown = function (e) {
                flag = true
                moveX = e.clientX;
                moveY = e.clientY;
                lastMoveX = e.clientX;
                lastMoveY = e.clientY;
                [clientWidth, clientHeight] = [document.documentElement.clientWidth, document.documentElement.clientHeight];
                [translateX, translateY] = _canvas.style.transform.match(/(\-?\+?\d*\.?\d)/g);
                [positionX, positionY] = [_canvas.offsetLeft, _canvas.offsetTop];

            }
            _canvas.onmousemove = function (e) {
                if (flag) {

                    distanceX = e.clientX - lastMoveX
                    distanceY = e.clientY - lastMoveY

                    var disX = Number(translateX) + Number(distanceX)
                    var disY = Number(translateY) + Number(distanceY)
                    // console.log(positionX, disX, _canvas.width, clientWidth)
                    // boundary
                    if (positionX + disX <= 0) {
                        disX = -positionX
                    } else if (positionX + disX + _canvas.width >= clientWidth) {
                        disX = clientWidth - positionX - _canvas.width
                    }
                    if (positionY + disY <= 0) {
                        disY = -positionY
                    } else if (positionY + disY + _canvas.height >= clientHeight) {
                        disY = clientHeight - positionY - _canvas.height
                    }

                    // var XX = clientWidth / 2 - _canvas.width / 2
                    // var YY = clientHeight / 2 - _canvas.height / 2
                    // if (Math.abs(disX) > XX) {
                    //     disX = XX * (disX / Math.abs(disX))
                    // }
                    // if (Math.abs(disY) > YY) {
                    //     disY = YY * (disY / Math.abs(disY))
                    // }
                    Object.assign(_canvas.style, {
                        transform: `translate(${disX}px, ${disY}px)`,
                    })
                }

            }
            _canvas.onmouseup = function (e) {
                flag = false
            }
            _canvas.onmouseleave = function (e) {
                flag = false
            }
            globalVariable.hasMini = true
            player.rootEle.append(_canvas)
            return true

        },
        switchFullScreen() {
            if (document.fullscreen) {
                document.exitFullscreen()
                return false
            } else {
                player.rootEle.requestFullscreen()
                return true
            }
        },


        // 后续完成
        setInfo() { },// 设置信息
        setCaption() { },// 设置字幕
        setLanguage() { },// 选择语言
        changeVideo(src) { },  // 更换视频，可以用于 播放下一步 视频

        // listener event
        listener(event, callback) {
            if (!event || !callback) {
                throw 'listener(event, callback) ,Both parameters are required'
            }
            var fn = function () {
                callback && callback.apply(this, arguments)
            }
            player.on(event, fn);
            return function cancelListener() {
                player.off(event, fn);
            }
        },
        // listener event once
        once(event, callback) {
            if (!event || !callback) {
                throw 'listener(event, callback) ,Both parameters are required'
            }
            var fn = function () {
                callback && callback.apply(this, arguments);
                player.off(event, fn);
            }
            player.on(event, fn);
            return function cancelListener() {
                player.off(event, fn);
            }
        },
    })
}

// listener methods

// /**
//  * Triggered when there is an error from the element or MSE source buffer.
//  * @event MediaPlayerEvents#ERROR
//  */
// this.ERROR = 'error';
// /**
//  * 片段下载完成时触发。
//  */
// this.FRAGMENT_LOADING_COMPLETED = 'fragmentLoadingCompleted';

// /**
//  * 片段下载开始时触发。
//  */
// this.FRAGMENT_LOADING_STARTED = 'fragmentLoadingStarted';

// /**
//  * 当由于检测到基于ABR放弃规则的缓慢下载而放弃片段下载时触发​​。(自动切换画质)
//  */
// this.FRAGMENT_LOADING_ABANDONED = 'fragmentLoadingAbandoned';

// /**
//  * 改变 ABR  画质 声音 时触发
//  */
// this.QUALITY_CHANGE_REQUESTED = 'qualityChangeRequested';

// /**
//  * 在屏幕上呈现新的ABR质量时触发。
//  */
// this.QUALITY_CHANGE_RENDERED = 'qualityChangeRendered';

// /**
//  * 在渲染新轨道时触发。
//  */
// this.TRACK_CHANGE_RENDERED = 'trackChangeRendered';

// /**
//  * 重置播放器时触发。
//  */
// this.STREAM_TEARDOWN_COMPLETE = 'streamTeardownComplete';

// /**
//  * 渲染字幕时触发。
//  */
// this.CAPTION_RENDERED = 'captionRendered';

// /**
//  * 当有足够的可用数据可以播放媒体时发送，至少持续几帧。这对应于HAVE_ENOUGH_DATA readyState。
//  */
// this.CAN_PLAY = 'canPlay';

// /**
//  * 播放结束时发送。
//  */
// this.PLAYBACK_ENDED = 'playbackEnded';

// /**
//  * Sent when an error occurs.  The element's error
//  * attribute contains more information.
//  * 发生错误时发送。元素的error属性包含更多信息。
//  */
// this.PLAYBACK_ERROR = 'playbackError';

// /**
//  * Sent when playback is not allowed (for example if user gesture is needed).
//  * 当不允许播放时发送（例如，如果需要用户手势）。
//  */
// this.PLAYBACK_NOT_ALLOWED = 'playbackNotAllowed';

// /**
//  * The media's metadata has finished loading; all attributes now
//  * contain as much useful information as they're going to.
//  * @event MediaPlayerEvents#PLAYBACK_METADATA_LOADED
//  */
// this.PLAYBACK_METADATA_LOADED = 'playbackMetaDataLoaded';

// /**
//  * Sent when playback is paused.
//  * 播放暂停时发送。
//  */
// this.PLAYBACK_PAUSED = 'playbackPaused';

// /**
//  * Sent when the media begins to play (either for the first time, after having been paused,
//  * or after ending and then restarting).
//  * 在媒体开始播放时发送（在第一次，暂停后或结束然后重新启动后）。
//  */
// this.PLAYBACK_PLAYING = 'playbackPlaying';

// /**
//  * Sent when the playback speed changes.
//  * 播放速度改变时发送。
//  */
// this.PLAYBACK_RATE_CHANGED = 'playbackRateChanged';

// /**
//  * Sent when a seek operation completes.
//  * 查找操作完成时发送。
//  */
// this.PLAYBACK_SEEKED = 'playbackSeeked';

// /**
//  * Sent when playback of the media starts after having been paused;
//  * that is, when playback is resumed after a prior pause event.
//  * 暂停后开始播放媒体时发送。也就是说，在先前的暂停事件后恢复播放。
//  */
// this.PLAYBACK_STARTED = 'playbackStarted';

// /**
//  * The time indicated by the element's currentTime attribute has changed.
//  * 元素的currentTime属性指示的时间已更改。
//  */
// this.PLAYBACK_TIME_UPDATED = 'playbackTimeUpdated';

// /**
//  * Sent when the media playback has stopped because of a temporary lack of data.
//  * 由于暂时缺少数据而在媒体播放停止时发送。
//  */
// this.PLAYBACK_WAITING = 'playbackWaiting';
