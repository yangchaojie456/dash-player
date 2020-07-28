export var utils = {
    formatTime(current, duration) {
        var innerMinute = duration < 60
        var innerHour = duration < 3600
        if (innerMinute) {
            return {
                current: current,
                duration: duration
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
}
export function isNumber(number) {
    return typeof number === 'number'
}
export function isString(string) {
    return typeof string === 'string'
}
export function isBoolean(boolean) {
    return typeof boolean === 'boolean'
}