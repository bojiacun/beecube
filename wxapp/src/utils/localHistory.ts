import Taro from '@tarojs/taro';
import _ from "lodash";

const MY_FAVORITE = "MY_FAVORITE";
const MY_LOOKUP = "MY_LOOKUP";
const MY_VIEW_RECORD = "MY_VIEW_RECORD";


const getFavorites = () => {
    return Taro.getStorageSync(MY_FAVORITE) || [];
}
const putFavorite = (url: string, info: any) => {
    const favorites = Taro.getStorageSync(MY_FAVORITE) || [];
    if(_.findIndex(favorites, {url: url}) < 0) {
        info.url = url;
        favorites.push(info);
        Taro.setStorageSync(MY_FAVORITE, favorites);
    }
}
const removeFavorite = (url: string) => {
    let favorites = Taro.getStorageSync(MY_FAVORITE) || [];
    _.remove(favorites, function(n:any) {
        return n.url === url;
    });
    console.log(favorites);
    Taro.setStorageSync(MY_FAVORITE, favorites);
}
const isFavorite = (url:string) => {
    const favorites = Taro.getStorageSync(MY_FAVORITE) || [];
    return _.findIndex(favorites, {url: url}) >= 0;
}

const getLookups = () => {
    return Taro.getStorageSync(MY_LOOKUP) || [];
}
const putLookup = (url: string, info: any) => {
    const favorites = Taro.getStorageSync(MY_LOOKUP) || [];
    if(_.findIndex(favorites, {url: url}) < 0) {
        info.url = url;
        favorites.push(info);
        Taro.setStorageSync(MY_LOOKUP, favorites);
    }
}
const removeLookup = (url: string) => {
    let favorites = Taro.getStorageSync(MY_LOOKUP) || [];
    _.remove(favorites, function(n:any) {
        return n.url === url;
    });
    Taro.setStorageSync(MY_LOOKUP, favorites);
}
const getViewRecords = () => {
    return Taro.getStorageSync(MY_VIEW_RECORD) || [];
}
const putViewRecord = (url: string, info: any) => {
    let favorites = Taro.getStorageSync(MY_VIEW_RECORD) || [];
    if(_.findIndex(favorites, {url: url}) < 0) {
        info.url = url;
        favorites.push(info);
        if(favorites.length > 20) {
            favorites = _.slice(favorites, 0, favorites.length - 20);
        }
        Taro.setStorageSync(MY_VIEW_RECORD, favorites);
    }
}
const removeViewRecord = (url: string) => {
    let favorites = Taro.getStorageSync(MY_VIEW_RECORD) || [];
    _.remove(favorites, function(n:any) {
        return n.url === url;
    });
    Taro.setStorageSync(MY_VIEW_RECORD, favorites);
}

export default {
    putFavorite,
    isFavorite,
    removeFavorite,
    putLookup,
    removeLookup,
    putViewRecord,
    removeViewRecord,
    getFavorites,
    getLookups,
    getViewRecords
}
