module.exports = {
    utils: {
        formatTime(current, duration) {
            var innerMinute = duration < 60
            var innerHour = duration < 3600
            if (innerMinute) {
                return {
                    current: String(parseInt(current)).padStart(2, 0),
                    duration: String(parseInt(duration)).padStart(2, 0)
                }
            } else if (innerHour) {
                return {
                    current: String(parseInt(current / 60)).padStart(2, 0) + ':' + String(parseInt(current % 60)).padStart(2, 0),
                    duration: String(parseInt(duration / 60)).padStart(2, 0) + ':' + String(parseInt(duration % 60)).padStart(2, 0)
                }
            } else {
                return {
                    current: String(parseInt(current / 60 / 60)).padStart(2, 0) + ':' + String(parseInt(current / 60 % 60)).padStart(2, 0) + ':' + String(parseInt(current % 60)).padStart(2, 0),
                    duration: String(parseInt(duration / 60 / 60)).padStart(2, 0) + ':' + String(parseInt(duration / 60 % 60)).padStart(2, 0) + ':' + String(parseInt(duration % 60)).padStart(2, 0)
                }
            }
        }
    },
    isNumber(number) {
        return typeof number === 'number'
    },
    isString(string) {
        return typeof string === 'string'
    },
    isBoolean(boolean) {
        return typeof boolean === 'boolean'
    }
}
