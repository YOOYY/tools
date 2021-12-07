module.exports = {
    lintOnSave:false,
    indexPath:'dashboard.htm',
    chainWebpack: config => {
        config
        .plugin('html')
        .tap(args => {
            args[0].title= '项目管理'
            return args
        })
    }
}