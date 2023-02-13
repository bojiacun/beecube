import path from 'path';

const config = {
    projectName: 'Recycle',
    date: '2021-5-3',
    designWidth: 375,
    deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2,
        375: 2 / 1,
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [],
    defineConstants: {},
    copy: {
        patterns: [
            {from: 'src/siteinfo.js', to: 'dist/siteinfo.js'},
            {from: 'src/assets', to: 'dist/assets'},
            {from: 'src/manager/static', to: 'dist/manager/static'},
        ],
        options: {}
    },
    framework: 'react',
    alias: {
        'siteInfo': path.resolve(__dirname, '../siteinfo.js')
    },
    mini: {
        postcss: {
            pxtransform: {
                enable: true,
                config: {}
            },
            url: {
                enable: true,
                config: {
                    limit: 1024 // 设定转换尺寸上限
                }
            },
            cssModules: {
                enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]',
                }
            },
        },
        miniCssExtractPluginOption: {
            ignoreOrder: true
        },
        webpackChain(chain) {
            // chain.merge({
            //     externals: [(context, request, callback)=>{
            //         if(request.startsWith('./siteinfo.js')) {
            //             return callback(null, `commonjs ${request}`)
            //         }
            //         callback();
            //     }]
            // })
        }
    },
    h5: {
        publicPath: '/',
        staticDirectory: 'static',
        postcss: {
            autoprefixer: {
                enable: true,
                config: {}
            },
            cssModules: {
                enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]'
                }
            }
        }
    }
}

module.exports = function (merge) {
    if (process.env.NODE_ENV === 'development') {
        return merge({}, config, require('./dev'))
    }
    return merge({}, config, require('./prod'))
}
