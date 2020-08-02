const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    target: 'web',
    output: {
        filename: 'player.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,   //匹配JS文件  
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
};