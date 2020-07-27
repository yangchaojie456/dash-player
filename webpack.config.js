const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        filename: 'main.js',
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