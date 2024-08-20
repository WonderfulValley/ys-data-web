const path = require('path');
module.exports = {
    devServer: {
        port: process.env.DEFAULT_PORT,
        disableHostCheck: true,
        // 配置跨域请求头，解决开发环境的跨域问题
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    publicPath: '/crawler/web',
    outputDir: 'dist/ys-data-web/web',
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/style/settings.scss";`
            }
        },
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns:[
                // 这里不能使用配置中的别名路径（例如：alias 配置下的路径别名）
                path.resolve(__dirname, './src/style/global-theme.less'),
            ],
        },
    },
    configureWebpack: {
        externals: {
            'echarts': 'echarts',
        },
        performance: {
            hints: false
        },
        output: {
            // 微应用的包名，这里与主应用中注册的微应用名称一致
            library: "noticeApp",
            // 将你的 library 暴露为所有的模块定义下都可运行的方式
            libraryTarget: 'umd',
            // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
            jsonpFunction: `webpackJsonp_noticeApp`,
        },
    },
};
