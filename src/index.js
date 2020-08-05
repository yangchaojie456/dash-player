
var MediaPlayer = require('./simplify/index.js')

MediaPlayer.version = '0.3.0';

typeof window !== 'undefined' && (window.MediaPlayer = MediaPlayer);
if (typeof module === "object" && typeof module.exports === "object") {
    // module.exports =
    module.exports = MediaPlayer;
    // Allow use of default import syntax in TypeScript
    module.exports.default = MediaPlayer;
} 