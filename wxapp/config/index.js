const config = {
    projectName: '汇智拍卖',
    date: '2023-2-13',
    designWidth: 375,
    deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2,
        375: 2,
    },
    // // 配置 NutUI 375 尺寸
    // designWidth: 375,
    // deviceRatio: {
    //   640: 2.34 / 2,
    //   750: 1,
    //   828: 1.81 / 2,
    //   375: 2 / 1,
    // },

    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: ['@dcasia/mini-program-tailwind-webpack-plugin/dist/taro'],
    defineConstants: {},
    copy: {
        patterns: [
            {from: 'src/siteinfo.js', to: 'dist/siteinfo.js'},
        ],
        options: {}
    },
    framework: 'react',
    compiler: 'webpack5',
    cache: {
        enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    mini: {
        compile: {
            exclude: []
        },
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
                    generateScopedName: '[name]__[local]___[hash:base64:5]'
                }
            }
        },
        webpackChain(chain) {
            chain.merge({
                externals: {
                    './siteinfo.js': 'commonjs2 ./siteinfo.js',
                    '../siteinfo.js': 'commonjs2 ./siteinfo.js',
                }
            })
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
                enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]'
                }
            }
        }
    },
    rn: {
        appName: 'taroDemo',
        postcss: {
            cssModules: {
                enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
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
