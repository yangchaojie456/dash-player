import { MediaPlayer } from './simplify/index.js'

MediaPlayer.version = '0.1.0';
typeof window !== 'undefined' && (window.MediaPlayer = MediaPlayer);