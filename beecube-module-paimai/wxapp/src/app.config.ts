export default defineAppConfig({
    pages: [
        'pages/index/index',
        'pages/index/diy',
        'pages/index/search',
        'pages/index/test',
        'pages/shop/cart',
        'pages/shop/confirm',
        'pages/auction/detail',
        'pages/auction/list',
        'pages/my/index',
        'pages/my/realauth',
        'pages/my/goods',
        'pages/my/qrcode',
        'pages/my/wallet',
        'pages/my/wallet/charge',
        'pages/my/wallet/withdraw',
        'pages/my/addresses',
        'pages/my/newaddress',
        'pages/my/deposits',
        'pages/my/coupons',
        'pages/my/offers',
        'pages/my/views',
        'pages/my/follows',
        'pages/my/profile',
        'pages/my/profile/phone',
        'pages/my/profile/nickname',
        'pages/my/profile/email',
        'pages/my/profile/auth',
        'pages/performance/list',
        'pages/goods/buyouts',
        'pages/goods/search',
    ],
    window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: 'WeChat',
        navigationBarTextStyle: 'black',
        navigationStyle: 'custom',
    },
    subPackages: [{
        root: 'integral',
        pages: [
            'member/center',
            'member/records',
            'member/rules',
            'member/withdraw',
        ],
    },
        {
            root: 'goods',
            pages: [
                'pages/auctions',
                'pages/detail',
                'pages/collect',
                'pages/detail2',
                'pages/offers',
                'pages/confirm',
            ],
        },
        {
            root: 'article',
            pages: [
                'pages/detail',
                'pages/detail2',
                'pages/services',
                'pages/normal',
                'pages/video',
                'pages/detail_h5',
                'pages/index_normal',
                'pages/index_video',
                'pages/search',
            ]
        },
        {
            root: 'performance',
            pages: [
                'pages/detail',
                'pages/detail2',
                'pages/deadline',
                'pages/public',
                'pages/sync',
                'pages/invite',
                'pages/invites',
                'pages/invited',
            ],
        },
        {
            root: 'live',
            pages: [
                'pages/room',
                'pages/history',
                'pages/list',
                'pages/detail',
            ]
        },
        {
            root: 'order',
            pages: [
                'pages/orders',
                'pages/taxs',
                'pages/taxs/create',
                'pages/taxs/history',
                'pages/orders/detail',
                'pages/orders/after',
            ]
        }
    ],
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
