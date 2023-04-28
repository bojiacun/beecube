export default defineAppConfig({
    pages: [
        'pages/index/index',
        'pages/index/search',
        'pages/articles/detail',
        'pages/articles/detail2',
        'pages/articles/services',
        'pages/articles/normal',
        'pages/articles/video',
        'pages/articles/detail_h5',
        'pages/articles/index_normal',
        'pages/articles/index_video',
        'pages/articles/search',

        'pages/goods/buyouts',
        'pages/goods/auctions',
        'pages/goods/detail',
        'pages/goods/detail2',
        'pages/goods/offers',
        'pages/goods/confirm',
        'pages/shop/cart',
        'pages/shop/confirm',
        'pages/performance/detail',
        'pages/performance/detail2',
        'pages/performance/deadline',
        'pages/performance/public',
        'pages/performance/list',
        'pages/performance/sync',
        'pages/performance/invite',
        'pages/performance/invited',
        'pages/auction/detail',
        'pages/auction/list',
        'pages/my/index',
        'pages/my/qrcode',
        'pages/my/wallet',
        'pages/my/wallet/charge',
        'pages/my/wallet/withdraw',
        'pages/my/addresses',
        'pages/my/newaddress',
        'pages/my/deposits',
        'pages/my/offers',
        'pages/my/orders',
        'pages/my/orders/detail',
        'pages/my/orders/after',
        'pages/my/views',
        'pages/my/follows',
        'pages/my/profile',
        'pages/my/profile/phone',
        'pages/my/profile/nickname',
        'pages/my/profile/email',
        'pages/my/profile/auth',

        'pages/live/room',
        'pages/live/history',
        'pages/live/list'
    ],
    window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: 'WeChat',
        navigationBarTextStyle: 'black',
        navigationStyle: 'custom',
    },

    tabBar: {
        list: [
            {
                pagePath: 'pages/index/index',
                text: '首页',
            },
            {
                pagePath: 'pages/performance/list',
                text: '专场列表',
            },
            {
                pagePath: 'pages/goods/buyouts',
                text: '一口价列表',
            },
            {
                pagePath: 'pages/shop/cart',
                text: '购物车',
            },
            {
                pagePath: 'pages/my/index',
                text: '我的',
            },
        ],
        custom: true,
    },

    permission: {
        "scope.userLocation": {
            "desc": "你的位置信息将用于小程序位置接口的效果展示"
        },
        "scope.userLocationBackground": {
            "desc": "你的位置信息将用于小程序位置接口的效果展示"
        }
    },
    requiredPrivateInfos: [
        "onLocationChange",
        "startLocationUpdate",
        "chooseLocation"
    ],
    usingComponents: {
        'modal': './components/custom-modal/index',
        'live': './components/live-room/index',
        "zego-nav": "./components/zego-nav/zego-nav"
    }
})
