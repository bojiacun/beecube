export default defineAppConfig({
    pages: [
        'pages/index/index',
        'pages/goods/buyouts',
        'pages/goods/auctions',
        'pages/goods/detail',
        'pages/goods/offers',
        'pages/performance/detail',
        'pages/auction/detail',
        'pages/my/index',
        'pages/my/wallet',
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
    ]
})
