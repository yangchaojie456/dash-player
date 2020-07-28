import { playerSettings } from './config/setting'
import { isNumber, isString, isBoolean } from './utils'
export function initMethods(player) {
    var globalVariable = player.globalVariable
    Object.assign(player, {
        // use methods from player.__proto__
        play: player.play,
        pause: player.pause,
        setPlaybackRate: player.setPlaybackRate,
        setVolume: player.setVolume,
        setMute: player.setMute,

        // encapsulation methods
        /**
         * fast forward time
         * 快进
         * @param {Number} time 
         * @param {Function} callback after finish 
         */
        forward(time, callback) {
            if (!isNumber(time)) {
                throw new TypeError('forward( time , callback ?),time must be Number')
            }
            var disTime = player.currentTime + time
            player.seek(disTime > player.duration ? player.duration : disTime)
            var fn = function () {
                typeof callback == "function" && callback()
            }
            player.once('playbackPlaying', fn)
        },
        /**
         * fast backward time
         * 快退
         * @param {Number} time 
         * @param {Function} callback after finish 
         */
        backUp(time, callback) {
            if (!isNumber(time)) {
                throw new TypeError('forward( time , callback ?),time must be Number')
            }
            var disTime = player.currentTime - time
            player.seek(disTime < 0 ? 0 : disTime)
            var fn = function () {
                typeof callback == "function" && callback()
            }
            player.once('playbackPlaying', fn)
        },
        /**
         * set play time
         * 设定播放位置
         * @param {Number} time 
         * @param {Function} callback after finish 
         */
        setSeek(time, callback) {
            if (!isNumber(time)) {
                throw new TypeError('forward( time , callback ?),time must be Number')
            }
            player.seek(time)
            var fn = function () {
                typeof callback == "function" && callback()
            }
            player.once('playbackPlaying', fn)
        },
        /**
         * get MediaType quality
         * 获取各种媒体品质
         * @param {*} type 	MediaType : "video" | "audio" | "text" | "fragmentedText" | "embeddedText" | "image"
         */
        getQuality(type) {
            if (!type) {
                var map = {};
                ["video", "audio", "text", "fragmentedText", "embeddedText", "image"].forEach(res => {
                    map[res] = player.getBitrateInfoListFor(res).map(res => ({ ...res }))
                })
                return map
            } else if (type && (type == "video" || type == "audio" || type == "text" || type == "fragmentedText" || type == "embeddedText" || type == "image")) {
                return player.getBitrateInfoListFor(type).map(res => ({ ...res }))
            } else {
                throw new RangeError('param:type choose from "video" | "audio" | "text" | "fragmentedText" | "embeddedText" | "image" | falsity ')
            }
        },
        /**
         * set MediaType quality
         * @param {*} type 	MediaType : "video" | "audio" | "text" | "fragmentedText" | "embeddedText" | "image" 
         * @param {*} qualityIndex  get from getQuality()
         * @param {*} callback after finish 
         * @param {*} mode immediately/delay  Switch now or wait until the loaded video has been played
         * 立即切换 还是等到已加载视频 播放完成后切换
         */
        setQuality(type, qualityIndex, callback, mode = 'immediately') {
            if (type && (type == "video" || type == "audio" || type == "text" || type == "fragmentedText" || type == "embeddedText" || type == "image")) {
                if (isNaN(qualityIndex)) {
                    throw new TypeError('setQuality(type, qualityIndex,callback?,mode?), qualityIndex:Number from  getQuality(type?)')
                } else if (!player.getQuality(type).map(res => res.qualityIndex).includes(qualityIndex)) {
                    throw new TypeError('setQuality(type, qualityIndex,callback?,mode?), qualityIndex:Number from  getQuality(type?)')
                }

                globalVariable.qualityDep[type] = qualityIndex

                // execute quality queue
                clearTimeout(globalVariable.qualityTimeout)
                globalVariable.qualityTimeout = setTimeout(() => {
                    var fn = function () {
                        if (mode == "delay") {
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
                        player.once('playbackSeeking', function (e) {

                            if (globalVariable.qualityAfterStartTime) {

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
                throw new RangeError('param:type choose from "video" | "audio" | "text" | "fragmentedText" | "embeddedText" | "image" | falsity ')
            }
        },
        /**
         * Intelligent selection of image quality
         */
        autoQuality() {
            player.updateSettings(playerSettings);
            console.log('update')
        },
        /**
         * Switch to picture-in-picture mode
         * 切换画中画模式
         * @param {*} tip Prompt when the browser does not support PictureInPicture
         */
        switchPictureInPicture(tip) {
            var videoElement = player.videoEle
            if ('pictureInPictureEnabled' in document) {
                if (videoElement !== document.pictureInPictureElement) {
                    // enter
                    videoElement.requestPictureInPicture();
                    return globalVariable.pictureinpicture = true
                } else {
                    // exit
                    document.exitPictureInPicture();
                    return globalVariable.pictureinpicture = false
                }
            } else {
                tip = tip || 'The current browser does not support picture in picture. Please try using another browser'
                throw new EvalError(tip)
                alert(tip)
            }

        },
        /**
         * switch mini mode
         * 迷你模式切换
         * @param {*} size mini video window size
         * @param {*} position 
         */
        switchMiniMode(size, position) {
            // Small screen mode
            var lastCanvas = player.rootEle.querySelector("#CJ-canvas-screen")
            if (lastCanvas && lastCanvas.nodeName == "CANVAS") {
                player.rootEle.removeChild(lastCanvas)
                globalVariable.hasMini = false
                return false
            }
            if (typeof size !== 'object') {
                throw new TypeError('param:size will be Object')
            }
            if (!size.width && !size.height) {
                throw new TypeError('param:size must have property width or height')
            }
            if (typeof position !== 'object') {
                throw new TypeError('param:position will be Object')
            }
            if (!position.top && !position.left && !position.right && !position.bottom) {
                throw new TypeError('param:position must have property {top,left} or {top,right} or {bottom,left} or {bottom,right}')
            }
            if (!isString(position.top || '') || !isString(position.left || '') || !isString(position.right || '') || !isString(position.bottom || '')) {
                throw new TypeError('param:position Same format as position in style')
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
                top: position.top,
                left: position.left,
                bottom: position.bottom,
                right: position.right,
                transform: 'translate(0, 0)',
                'z-index': 9999
            })
            var context = _canvas.getContext("2d");
            switchToCanvas();
            function switchToCanvas() {
                if (videoEle.ended) {
                    return;
                }

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
        /**
         * switch full screen
         * @param {*} tip Prompt when the browser does not support full screen
         */
        switchFullScreen(tip) {
            if ('exitFullscreen' in document) {
                if (document.fullscreen) {
                    document.exitFullscreen()
                    return false
                } else {
                    player.rootEle.requestFullscreen()
                    return true
                }
            } else {
                tip = tip || 'The current browser does not support full screen. Please try using another browser'
                throw new EvalError(tip)
                alert(tip)
            }
        },
        /**
         * loop video  true/false
         * @param {Boolean} value          
         */
        setLoop(value) {
            if (!isBoolean(value)) {
                throw new TypeError('loop(value), param:value must be Boolean')
            }
            if (!value) {
                typeof globalVariable.loopListener == "function" && globalVariable.loopListener()
                globalVariable.loopListener = null
                player.videoEle.loop = false
            } else {
                globalVariable.loopListener = player.listener("playbackTimeUpdated", function () {
                    if (player.currentTime + 0.2 > player.duration) {
                        player.seek(0)
                    }
                })
                player.videoEle.loop = true
            }
        },
        // Complete later

        // setInfo() { },// 设置信息
        // setCaption() { },// 选择字幕
        // setLanguage() { },// 选择语言
        resetVideo(src) { },  // 更换视频，可以用于 播放下一步 视频
    })
}