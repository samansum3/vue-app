module.exports = {
//     devServer: {
//         proxy: 'https://invoice-express-app.herokuapp.com'
//     }
    configureWebpack:{
        performance: {
            hints: false
        },
        optimization: {
            splitChunks: {
                minSize: 10000,
                maxSize: 250000,
            }
        }
    }
}
