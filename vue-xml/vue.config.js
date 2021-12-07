module.exports = {
    lintOnSave:false,
    indexPath:'xml.htm',
    chainWebpack: config => {
        config
        .plugin('html')
        .tap(args => {
            args[0].title= '南通长牌牌型编辑器'
            return args
        })
    }
}