# dash-player
[![npm version](https://img.shields.io/badge/npm-v0.2.6-orange)](https://www.npmjs.com/package/dash-player)

# Introduction
This project is based on dash.js and implements a concise API for the H5 player.

本项目 基于dash.js，实现了一个简明API 的H5播放器。

# Motivation
When using dash.js, the API is too complex and cumbersome, and some common functions of the player are not reflected in dash.js.For example, there is no API to instantly switch resolutions, and to make it easier to create a fully functional H5 player library, use a simple H5 player library.dash-Player makes some simplifications to dash.For more complex functionality, refer to [dash.js](https://github.com/Dash-Industry-Forum/dash.js)

在使用dash.js 时，api 过于复杂繁琐，有些播放器常用功能，在dash.js上并没有体现。例如就不存在立即切换分辨率的API ，为了更简单创建一个功能完善，使用简单的H5播放器库。dash-player对dash 进行了一些简化。想要实现更复杂功能可以自行参考dash.js

Install
=======


Using npm:

```bash
 npm install dash-player
```


Using cdn:

```html
<script src="https://unpkg.com/dash-player/dist/player.js"></script>
```


Usage
========

### Getting Started

* Add dash.all.min.js to the end of the body.
```html
<body>
  ...
  <script src="yourPathToDash/player.js"></script>
</body>
```
* Create a video element somewhere in your html. 

```html
<div id="CJ-player-container">
  <video id="CJ-video" preload="auto"><video>
</div>
```
* `Now comes the good stuff. We need to create a MediaPlayer`
```javascript
var player = new MediaPlayer({
    src: "http://127.0.0.1:8080/mpd/index.mpd",
    rootEle: '#CJ-player-container',
    videoEle: '#CJ-video',
    autoplay: true,
    controls: false,
    loop: true
})
```
* When it is all done, it should look similar to this:
```html
<!doctype html>
<html>
    <head>
        <title>player sample</title>
        <style>
            video {
                width:800px;                
            }
        </style>
    </head>
    <body>
        <div id="CJ-player-container">
          <video id="CJ-video" preload="auto"><video>
        </div>
        <script src="yourPathToDash/player.js"></script>
        <script>
            var player = new MediaPlayer({
                src: "http://127.0.0.1:8080/mpd/index.mpd",
                rootEle: '#CJ-player-container',
                videoEle: '#CJ-video',
                autoplay: true,
                controls: false,
                loop: true
            })
            player.once('canPlay', function () {
              console.log('ready')
            })
        </script>
    </body>
</html>
```


# API


Propertys
-------

* **autoplay** <_read only_> Boolean
* **controls** <_read only_> String
* **paused** <_read only_> Boolean
* **loop** <_read only_> Boolean
* **ended** <_read only_> Boolean
* **duration** <_read only_> Number
* **currentTime** <_read only_> Number
* **playbackRate** <_read only_> Number
* **volume** <_read only_> `range of values: 0-1 `
* **muted** <_read only_>  Boolean
    >note : Mute mode does not change the existing volume value
* **src** <_read only_> URL
* **progress** <_read only_> `range of values: 0-1`
* **formatTime** <_read only_> Object like {current: "00:47", duration: "02:29"}
    >note : The formatted time can be used to show progress
* **pictureinpicture** <_read only_> Boolean
* **Mini** <_read only_> Boolean
* **fullScreen** <_read only_> Boolean


***
Methods
-------


### play
```js
// play video
player.play([callback])
// callback after finish
```

### pause
```js
// pause video
player.pause([callback])
// callback after finish
```

### forward
```js
/**
 * fast forward time
 * 快进
 * @param {Number} time 
 * @param {Function} callback after finish 
 */
player.forward(Number:time,[callback])
```

### backUp
```js
/**
 * fast backward time
 * 快退
 * @param {Number} time 
 * @param {Function} callback after finish 
 */
player.backUp(Number:time,[callback])
```
### setSeek
```js
/**
 * set play time
 * 设定播放位置
 * @param {Number} time 
 * @param {Function} callback after finish 
 */
player.setSeek(Number:time,[callback])
```

### setPlaybackRate
```js
// set the Video Element's playback rate.
player.setPlaybackRate(Number:value)
```

### setVolume
```js
// A double indicating the audio volume, from 0.0 (silent) to 1.0 (loudest).
player.setVolume(Number:value)
```

### setMute
```js
// set the Video Element's muted state
player.setMute(Boolean:value)
```

### getQuality
```js
/**
 * get current MediaType quality
 * 获取各种媒体品质
 * @param {*} type 	MediaType : "video" | "audio" | "text" | "fragmentedText" | "embeddedText" | "image"
 */
player.getQuality([String:type])
```

### getMaxQuality
```js
/**
 * get max bitrate
 * @param {*} type 
 */
player.getMaxQuality([String:type])
```

### setMaxQuality
```js
/**
 * set max bitrate
 * @param {*} type MediaType : "video" | "audio" 
 * @param {*} bitrate Kbit
 */
player.setMaxQuality([String:type],Number:bitrate)
```

### getQualityList
```js
/**
 * get list for MediaType quality
 * 获取各种媒体品质
 * @param {*} type 	MediaType : "video" | "audio" | "text" | "fragmentedText" | "embeddedText" | "image"
 */
player.getQualityList([String:type])
```

### setQuality
```js
/**
 * set MediaType quality
 * @param {*} type 	MediaType : "video" | "audio" | "text" | "fragmentedText" | "embeddedText" | "image" 
 * @param {*} qualityIndex  get from getQuality()
 * @param {*} callback after finish 
 * @param {*} mode immediately/delay  Switch now or wait until the loaded video has been played
 * 立即切换 还是等到已加载视频 播放完成后切换
 */
player.setQuality(String:type, Boolean:qualityIndex, Function:callback, String:mode = 'immediately')
```

### setAutoQuality
```js
/**
 * Intelligent selection of image quality
 * 自动选择画质
 */
player.setAutoQuality()
```

### setLoop
```js
/**
 * loop video  true/false
 * @param {Boolean} value          
 */
player.setLoop(Boolean:value)
```

### switchPictureInPicture
```js
/**
 * Switch to picture-in-picture mode
 * @param {*} tip Prompt when the browser does not support PictureInPicture
 */
player.switchPictureInPicture(String:tip)
```

### switchMiniMode
```js
 /**
 * switch mini mode
 * @param {*} size mini video window size
 * @param {*} position 
 */
player.switchMiniMode(size, position)
```

### switchFullScreen
```js
/**
 * switch full screen
 * @param {*} tip Prompt when the browser does not support full screen
 */
player.switchFullScreen(tip)
```

***

Events
------

### listener
```js
/**
 * Listens for an event and returns a function to cancel the listening
 * 监听一个事件并且 返回一个函数用于取消监听
 * @param {String} event 
 * @param {Function} callback 
 */
player.listener(event, callback)
```
```js
// sample：Output video length and playback progress
var cancelEvent = player.listener("playbackTimeUpdated", function () {
    console.log(player.formatTime.current,player.formatTime.duration)
})
// Unlisten for video playback progress
cancelEvent()
```

### once
```js
/**
 * Listen for an event once, and return a function to cancel the listen
 * 侦听事件一次，然后返回一个函数来取消侦听
 * @param {Sting} event 
 * @param {Function} callback 
 */
player.once(event, callback)
```
```js
// sample：Output video ready state for once
var cancelEvent = player.once('canPlay', function () {
    console.log('canPlay')
})
// Abort interception
cancelEvent()
```


### Common event
```javascript

// listener methods
// 
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

```


# License
[BSD license](https://github.com/Dash-Industry-Forum/dash.js/blob/development/LICENSE.md)