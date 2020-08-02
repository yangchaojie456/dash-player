import { MediaPlayer } from './simplify/index.js'

MediaPlayer.version = '0.2.3';
typeof window !== 'undefined' && (window.MediaPlayer = MediaPlayer);