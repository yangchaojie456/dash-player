export function initEvents(player) {
    Object.assign(player, {
        /**
         * Listens for an event and returns a function to cancel the listening
         * 监听一个事件并且 返回一个函数用于取消监听
         * @param {String} event 
         * @param {Function} callback 
         */
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
        /**
         * Listen for an event once, and return a function to cancel the listen
         * 侦听事件一次，然后返回一个函数来取消侦听
         * @param {Sting} event 
         * @param {Function} callback 
         */
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
        }
    })
}


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
