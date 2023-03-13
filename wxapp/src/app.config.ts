export default defineAppConfig({
    pages: [
        'pages/index/index',
        'pages/articles/detail',
        'pages/articles/list',
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
        'pages/performance/sync',
        'pages/auction/detail',
        'pages/auction/list',
        'pages/my/index',
        'pages/my/wallet',
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
        "getLocation",
        "chooseLocation"
    ]
})
