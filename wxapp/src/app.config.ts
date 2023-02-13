import {useGlobalIconFont} from "./components/iconfont/helper";

export default {
    pages: [
        'pages/index/index',
        'pages/index/index_h5',
        'pages/index/coupon_detail',
        'pages/index/search',
        'pages/site/index',
        'pages/site/change',
        'pages/site/vip',
        'pages/site/detail',
        'pages/site/bind',
        'pages/shop/index',
        'pages/subscribe/index',
        'pages/live/index',
        'pages/login/login',

        'pages/order/index',
        'pages/order/detail',
        'pages/order/grade',

        'pages/notice/detail',
        'pages/notice/index',


        'pages/my/index',
        'pages/my/favorites',
        'pages/my/lives',
        'pages/my/activities',
        'pages/my/works',
        'pages/my/deposits',
        'pages/my/view_records',
        'pages/my/coupons',
        'pages/my/address',
        'pages/my/redeem',
        'pages/my/new_address',
        'pages/my/children',
        'pages/my/new_child',
        'pages/my/wallet',
        'pages/my/score_record',
        'pages/my/wallet_water',
        'pages/my/share_center',
    ],
    usingComponents: useGlobalIconFont(),
    subPackages: [
        {
            "root": "shop",
            "name": "商城模块",
            "pages": [
                "pages/detail",
                "pages/list",
                "pages/suglist",
                "pages/seckilllist",
                "pages/scan_results",
                "pages/coupons",
                "pages/cart",
                "pages/confirm",
                "pages/orders",
                "pages/services",
                "pages/comments",
                "pages/taglist",
                'pages/order_detail',
                'pages/new_service',
                'pages/new_grade',
                "pages/success",
            ]
        },
        {
            "root": "subscribe",
            "name": "借阅模块",
            "pages": [
                "pages/detail",
                "pages/new_service",
                "pages/giveback",
                "pages/list",
                "pages/suglist",
                "pages/scan_results",
                "pages/taglist",
                "pages/cart",
                "pages/confirm",
                "pages/orders",
                "pages/success",
                "pages/giveback_success",
                "pages/services",
                'pages/order_detail',
            ]
        },
        {
            "root": "live",
            "name": "直播模块",
            "pages": [
                "pages/todaylist",
                "pages/historylist",
                "pages/detail",
                "pages/video",
                "pages/search",
                "pages/room",
                "pages/room_vertical",
            ],
        },
        {
            "root": "article",
            "name": "文章模块",
            "pages": [
                "pages/detail",
                "pages/index",
            ],
        },
        {
            "name": "活动模块",
            "root": "activity",
            "pages": [
                "pages/list",
                "pages/works",
                "pages/search",
                "pages/video",
                "pages/image",
                "pages/detail",
                "pages/upload",
            ],
        },
        {
            "root": "manager",
            "name": "管理模块",
            "pages": [
                "pages/index",
                "pages/members",
                "pages/agent_members",
                "pages/orders",
                "pages/services",
                "pages/service_check",
                "pages/order_detail",
                "pages/edit",
                "pages/site",
                "pages/detail",
                "pages/goods_list",
                "pages/stock",
                "pages/new_stock",
                "pages/subscribe_orders",
                "pages/subscribe_services",
                "pages/subscribe_service_check",
                "pages/subscribe_order_detail",
                "pages/subscribe_goods_list",
                "pages/subscribe_edit",
                "pages/subscribe_detail",
                "pages/subscribe_stock",
                "pages/new_subscribe_stock",
                "pages/site_activities",
                "pages/live_room",
                "pages/live",
                "pages/live_push",
                "pages/live_history",
                "pages/edit_history",
                "pages/edit_live_goods",
            ],
        },
    ],
    window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: '没大没小商城',
        navigationBarTextStyle: 'black',
        navigationStyle: 'custom'
    },
    tabBar: {
        color: '#8a8a8a',
        selectedColor: '#65B971',
        borderStyle: 'white',
        list: [
            {
                pagePath: 'pages/index/index',
                text: '首页',
            },
            {
                pagePath: 'pages/subscribe/index',
                text: '借阅',
            },
            {
                pagePath: 'pages/live/index',
                text: '直播',
            },
            {
                pagePath: 'pages/shop/index',
                text: '商城',
            },
            {
                pagePath: 'pages/my/index',
                text: '我的',
            },
        ],
        custom: true
    },
    permission: {
        "scope.userLocation": {
            "desc": "你的位置信息将用于小程序位置接口的效果展示"
        },
        "scope.userLocationBackground": {
            "desc": "你的位置信息将用于小程序位置接口的效果展示"
        }
    }
}
