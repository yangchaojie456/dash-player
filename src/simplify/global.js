export function initGlobal(player) {
    Object.assign(player, {
        globalVariable: {
            qualityDep: {},
            qualityTimeout: null,
            qualityAfterStartTime: null,
            pictureinpicture: false,
            hasMini: false,
            qualityChangeFinish: null,
            loopListener: null
        }
    })
}