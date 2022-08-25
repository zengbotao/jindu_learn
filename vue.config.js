// npm run build 自动设置process.env.NODE_ENV => 'production'
// npm run serve 则会设置为devlopment

const isProduction = process.env.NODE_ENV === 'production';
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin')


const plugins = [];
let externals = {};

const cdn = {
    dev:{
        css:[],js:[]
    },
    build:{
       css:[],
       js:[
           
        'https://cdn.bootcdn.net/ajax/libs/axios/0.27.2/axios.min.js',
        'https://cdn.bootcss.com/vue/2.6.11/vue.min.js',
        'https://cdn.bootcss.com/vue-router/3.5.4/vue-router.min.js',
        ] 
    }
}


if (isProduction) {
    // 打包时压缩 混淆 取出js文件里面的注释 console。log（）内容的插件，从而减少打包的体积
    plugins.push(new UglifyJsPlugin({
        uglifyOptions: {
            output: {
                comments: false, // 去除注释
            },
            warnings: false, // 去除黄色警告,
            compress: {
                drop_console: true,
                drop_debugger: false, // 特定情况需要利用debugger防止调试
                pure_funcs: ['console.log'], // 移除console.log 避免console.error
            }
        }
    }));

    plugins.push(new CompressionWebpackPlugin({
        test:/\.(js|json|css)$/i,  // 图片一般不Gzip压缩 webpack-image-loader
        threshold:10240, // 只有在10kb以上才压缩
    }))

    // 附加全局引包的引用关系
    externals = {
    // from后的 : 使用全局暴露的对象名,具体看包暴露哪个
        vue:'Vue',
        'vue-router':'VueRouter',
        axios:'axios'
    }

}


module.exports = {
    productionSourceMap: !isProduction,
    configureWebpack: {
        devServer: {
            proxy: {
                '/api': {
                    target: 'http://1.116.64.64:5004/',
                    changeOrigin: true
                }
            }
        },
        plugins,
        externals
    },
    chainWebpack:config=>{
        // html-webpack-plugin
            config.plugin('html').tap(args=>{    
                if (isProduction) {
                    args[0].cdn = cdn.build
                }else {
                    args[0].cdn = cdn.dev;
                }
            return args;
        });
    }
}
