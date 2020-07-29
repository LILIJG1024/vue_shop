//这是项目发布阶段需要用到的babel插件
const prodPlugins = []
if (process.env.NODE_ENV === "production") {
    prodPlugins.push("transform-remove-console")
}
module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ],
    plugins: [
        [
            'component',
            {
                libraryName: 'element-ui',
                styleLibraryName: 'theme-chalk'
            }
        ],
        //在项目开发的时候才运行这个插件
        ...prodPlugins,
        "@babel/plugin-syntax-dynamic-import"
    ]
}