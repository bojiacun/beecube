import {LinkItem} from "~/components/form/BootstrapLinkSelector";
import {json, LoaderFunction} from "@remix-run/node";
import {requireAuthenticated, sessionStorage} from "~/utils/auth.server";
import {API_APP_LINKS, requestWithToken} from "~/utils/request.server";

export const AppLinks: LinkItem[] = [
    {
        label: '首页',
        url: '/pages/index/index',
    },
    {
        label: '商城首页',
        url: '/pages/shop/index',
    },
    {
        label: '商城购物车',
        url: '/shop/pages/cart',
    },
    {
        label: '商城商品分类列表',
        url: '/shop/pages/list',
    },
    {
        label: '商城商品推荐列表',
        url: '/shop/pages/suglist',
    },
    {
        label: '商城商品列表（标签搜索）',
        url: '/shop/pages/taglist',
        urlSuffix: {label: '标签', value: 'tag'},
        suffixOptions: '请输入要搜索的标签，只能设置一个标签',
    },
    {
        label: '商城今日秒杀列表页面',
        url: '/shop/pages/seckilllist',
    },
    {
        label: '商城商品详情页面',
        url: '/shop/pages/detail',
        urlSuffix: {label: '商城商品ID', value: 'id'},
        suffixOptions: '请输入商城商品ID',
    },

    {
        label: '商城订单列表',
        url: '/shop/pages/orders',
        urlSuffix: {label: '状态', value: 'tab'},
        suffixOptions: [
            {label: '已取消', value: '-1'},
            {label: '待支付', value: '0'},
            {label: '待发货', value: '1'},
            {label: '待收货', value: '2'},
            {label: '已完成', value: '3'},
        ]
    },
    {
        label: '商城待评价列表',
        url: '/shop/pages/comments',
    },
    {
        label: '商城订单售后列表',
        url: '/shop/pages/services',
    },

    {
        label: '借阅首页',
        url: '/pages/subscribe/index',
    },
    {
        label: '借阅书袋',
        url: '/subscribe/pages/cart',
    },
    {
        label: '借阅商品分类列表',
        url: '/subscribe/pages/list',
    },
    {
        label: '借阅商品推荐列表',
        url: '/subscribe/pages/suglist',
    },
    {
        label: '借阅商品列表（标签搜索）',
        url: '/subscribe/pages/taglist',
        urlSuffix: {label: '标签', value: 'tag'},
        suffixOptions: '请输入要搜索的标签，只能设置一个标签',
    },
    {
        label: '借阅商品详情页面',
        url: '/subscribe/pages/detail',
        urlSuffix: {label: '借阅商品ID', value: 'id'},
        suffixOptions: '请输入借阅商品ID',
    },
    {
        label: '借阅待评价列表',
        url: '/subscribe/pages/comments',
    },
    {
        label: '借阅订单列表',
        url: '/subscribe/pages/orders',
        urlSuffix: {label: '状态', value: 'tab'},
        suffixOptions: [
            {label: '已取消', value: -1},
            {label: '待支付', value: 0},
            {label: '待发货', value: 1},
            {label: '待收货', value: 2},
            {label: '借阅中', value: 3},
            {label: '归还中', value: 4},
            {label: '已归还', value: 5},
            {label: '损坏确认中', value: 6},
            {label: '待赔付', value: 7},
            {label: '已损坏', value: 8},
            {label: '已丢失', value: 9},
        ]
    },
    {
        label: '损坏或丢失列表',
        url: '/subscribe/pages/services',
    },

    {
        label: '直播首页',
        url: '/pages/live/index',
    },
    {
        label: '今日直播列表页面',
        url: '/live/pages/todaylist',
    },
    {
        label: '直播详情页面',
        url: '/live/pages/detail',
        urlSuffix: {label: '直播ID', value: 'id'},
        suffixOptions: '请输入直播ID',
    },
    {
        label: '直播回放列表页面',
        url: '/live/pages/historylist',
    },
    {
        label: '活动列表页面',
        url: '/activity/pages/list',
    },
    {
        label: '活动详情页面',
        url: '/activity/pages/detail',
        urlSuffix: {label: '活动ID', value: 'id'},
        suffixOptions: '请输入活动ID',
    },
    {
        label: '活动作品列表页面',
        url: '/activity/pages/works',
    },
    {
        label: '活动作品详情页面',
        url: '/activity/pages/workdetail',
        urlSuffix: {label: '活动作品ID', value: 'id'},
        suffixOptions: '请输入活动作品ID',
    },

    {
        label: '文章详情页面',
        url: '/article/pages/detail',
        urlSuffix: {label: '文章ID', value: 'id'},
        suffixOptions: '请输入文章的ID',
    },

    {
        label: '个人中心',
        url: '/pages/my/index',
    },
    {
        label: '兑换礼品',
        url: '/pages/my/redeem',
    },
    {
        label: '我的活动',
        url: '/pages/my/activities',
    },
    {
        label: '我的押金',
        url: '/pages/my/deposits',
    },
    {
        label: '我的钱包',
        url: '/pages/my/wallet',
    },
    {
        label: '我的收藏',
        url: '/pages/my/favorites',
    },
    {
        label: '我的直播',
        url: '/pages/my/lives',
    },
    {
        label: '我的作品',
        url: '/pages/my/works',
    },
    {
        label: '大小豆流水',
        url: '/pages/my/score_record',
    },
    {
        label: '分享中心',
        url: '/pages/my/share_center',
    },
    {
        label: '钱包流水',
        url: '/pages/my/wallet_water',
    },
    {
        label: '优惠券详情页面',
        url: '/pages/index/coupon_detail',
        urlSuffix: {label: 'ID', value: 'id'},
        suffixOptions: '请输入优惠券ID',
    },
];

export const loader: LoaderFunction = async ({request}) => {
    await requireAuthenticated(request);
    const session = await sessionStorage.getSession(request.headers.get('Cookie'));
    const appId = session.get("APPID");
    const url = new URL(request.url);
    url.searchParams.set("id", appId);
    let queryString = '?' + url.searchParams.toString();
    const result = await requestWithToken(request)(API_APP_LINKS + queryString);
    return json(result.result);
}