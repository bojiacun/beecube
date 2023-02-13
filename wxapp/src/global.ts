import Taro from "@tarojs/taro";
import request, {SERVICE_WINKT_MEMBER_HEADER} from "./utils/request";
import {isArray} from "lodash";
import configStore from './store';
import {setContext} from "./store/actions";
import {KEY_USERINFO} from "./utils/we7/util";
import _ from 'lodash';
import {currentContext} from "./utils/context";



const store = configStore();

export const Tabs = ['/pages/index/index', '/pages/shop/index', '/pages/subscribe/index', '/pages/my/index', '/pages/live/index'];

export const openSubscribeGoods = (goods:any, userInfo: any) => {
    if(!isBindSite(userInfo)) {
        //跳转到门店选择并绑定页面
        Taro.navigateTo({url: '/pages/site/index?action=bind&jump=back'}).then();
    }
    else {
        Taro.navigateTo({url: `/subscribe/pages/detail?id=${goods.id}`}).then();
    }
}

export const isBindSite = (userInfo: any) => {
    return userInfo?.memberInfo?.siteId;
}

//获取当前门店会员信息
export const getSiteVip = (siteId: number, callback) => {
    request.get("wxapp/levels/onsite/"+siteId, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res=>{
        typeof callback === 'function' && callback(res.data.data);
    })
}

export const calcShopCartCount = () => {
    let goods = Taro.getStorageSync('CART');
    if(goods) {
        goods = JSON.parse(goods) || [];
        if(goods.length > 0) {
            return goods.map(g => g.count).reduce((a,b)=>a+b);
        }
        else {
            return 0;
        }
    }
    else {
        return 0;
    }
}
export const removeShopCart = (item) => {
    let goods = Taro.getStorageSync("CART");
    if(goods) {
        goods = JSON.parse(goods);
    }
    else {
        goods = [];
    }
    _.remove(goods, {id: item.id});
    Taro.setStorageSync("CART", JSON.stringify(goods));
}
export const addShopCart = (item: any) => {
    item = {...item};
    if(item.images && !isArray(item.images)) {
        item.images = item.images.split(',');
    }
    item.count = 1;
    item.selected = true;
    let goods = Taro.getStorageSync("CART");
    if(goods) {
        goods = JSON.parse(goods);
    }
    else {
        goods = [];
    }
    let goodsItem = goods.filter(g => g.id == item.id)[0];
    if(goodsItem) {
        goodsItem.count++;
    }
    else {
        item.count = 1;
        item.goodsId = item.id;
        goods.push(item);
    }
    Taro.setStorageSync("CART", JSON.stringify(goods));
    Taro.showToast({title: '加入购物车成功', icon: 'success'}).then();
}

export const calcSubscribeCartCount = () => {
    let goods = Taro.getStorageSync('SUBSCRIBE-CART');
    if(goods) {
        goods = JSON.parse(goods) || [];
        if(goods.length > 0) {
            return goods.map(g => g.count).reduce((a,b)=>a+b);
        }
        else {
            return 0;
        }
    }
    else {
        return 0;
    }
}

export const removeSubscribeCart = (item) => {
    let goods = Taro.getStorageSync("SUBSCRIBE-CART");
    if(goods) {
        goods = JSON.parse(goods);
    }
    else {
        goods = [];
    }
    _.remove(goods, {id: item.id});
    Taro.setStorageSync("SUBSCRIBE-CART", JSON.stringify(goods));
}

export const addSubscribeCart = (item) => {
    item = {...item};
    if(item.images && !isArray(item.images)) {
        item.images = item.images.split(',');
    }
    item.count = 1;
    item.selected = true;
    let goods = Taro.getStorageSync("SUBSCRIBE-CART");
    if(goods) {
        goods = JSON.parse(goods);
    }
    else {
        goods = [];
    }
    let goodsItem = goods.filter(g => g.id == item.id)[0];
    if(goodsItem) {
        goodsItem.count = 1;
    }
    else {
        item.count = 1;
        item.goodsId = item.id;
        goods.push(item);
    }
    Taro.setStorageSync("SUBSCRIBE-CART", JSON.stringify(goods));
    Taro.showToast({title: '加入书袋成功', icon: 'success'}).then();
}


//刷新本地用户
export const refreshMemberInfo = (memberInfo:any) => {
    const context = currentContext();
    console.log("refresh member info", context);
    // @ts-ignore
    context.userInfo = {...context.userInfo, memberInfo:memberInfo};
    store.dispatch(setContext(context));
    Taro.setStorageSync(KEY_USERINFO, context.userInfo);
    return context.userInfo;
}
