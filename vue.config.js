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
//在打包的html文件中导入cdn对象，让他循环读取，加入cdn的链接
//注意查看webpack与vue cli里的区别 https://webpack.docschina.org/configuration

//腾讯课堂里的css压缩，loader，和npm package.json的官方文档 css.loader与styls.loader等内容

//package.json的属性文档，script的写法，https://docs.npmjs.com/cli/v8/configuring-npm/package-json#scripts

//不同webpack model的不同模式，版本的区别，多看看官方文档，包括属性和参数等等
// 开发时用webpack-dev-server
// "dev": "webpack-dev-server --content-base ./ --open --inline --hot --compress --history-api-fallback --config build/webpack.dev.config.js",
//生产模式用webpack
// "build": "webpack --progress --hide-modules --config build/webpack.prod.config.js && node versionInfo.js",
if (isProduction) {
    // 打包时压缩 混淆 取出js文件里面的注释 console。log（）内容的插件，从而减少打包的体积，使代码更安全，变量长短的改变等
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
    //Gzip的打包，只有在10kb以上才压缩。对应的，服务器中的nginx服务器需要配置压缩相关的解压配置
    plugins.push(new CompressionWebpackPlugin({
        test:/\.(js|json|css)$/i,  // 图片一般不Gzip压缩 webpack-image-loader
        threshold:10240, // 只有在10kb以上才压缩
    }))

    // 附加全局引包的引用关系，忽略这几个第三方包
    externals = {
    // from后的 : 使用全局暴露的对象名,具体看包暴露哪个
        vue:'Vue',
        'vue-router':'VueRouter',
        axios:'axios'
    }

}


module.exports = {
    productionSourceMap: !isProduction,
    //就不会生成map文件，map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
    //也就是说map文件相当于是查看源码的一个东西。如果不需要定位问题，并且不想被看到源码，就把productionSourceMap 置为false，既可以减少包大小，也可以加密源码。
    
    
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
    //transpileDependencies：['mint-ui','mand-mobile']
   // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。你可以启用本选项，以避免构建后的代码中出现未转译的第三方依赖。
    //不过，对所有的依赖都进行转译可能会降低构建速度。如果对构建性能有所顾虑，你可以只转译部分特定的依赖：给本选项传一个数组，列出需要转译的第三方包包名或正则表达式即可。
    
    //接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。即二次修改html的css和scipt标签
    chainWebpack:config=>{
        //postcss-pxtorem插件，css-rem
        //vconsole,移动端测试工具，发布时需要去掉
        //webpack-iconfont-plugin-node.js 开发时本地化svg文件成图标
        //url-loader,
        //file-loader,
        //vue-loader,等等其他打包设置参考https://blog.csdn.net/weixin_43090018/article/details/109570260
        //copywebpackplugin,打包完将文件复制到指定位置，一般用于静态min.js文件
        // html-webpack-plugin，具体可以参考vue cli官网的说明，浙商和这个项目的案例
            config.plugin('html').tap(args=>{    
                if (isProduction) {
                    args[0].cdn = cdn.build
                }else {
                    args[0].cdn = cdn.dev;
                }
            return args;//注意要返回传递给 html-webpack-plugin's 构造函数的新参数
        });
    }
}
