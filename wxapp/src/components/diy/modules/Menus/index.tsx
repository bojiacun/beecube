import { View } from "@tarojs/components";
import util from "../../../../utils/we7/util";
import request, {resolveUrl, SERVICE_WINKT_ORDER_HEADER} from "../../../../utils/request";
import FallbackImage from "../../../FallbackImage";
import {useEffect, useState} from "react";
import withLogin from "../../../login/login";
import Taro, {useDidShow} from "@tarojs/taro";

const MenusModule = (props: any) => {
    const { index, style, basic, imageStyle, checkLogin, ...rest } = props;
    const [hasOrderLink, setHasOrderLink] = useState<boolean>(false);
    const [hasShopOrderLink, setHasShopOrderLink] = useState<boolean>(false);
    const [menus, setMenus] = useState<any[]>(basic.menus);
    const isLogin = checkLogin();

    useEffect(()=>{
        //检测是否有订单类的连接，如果有则获取小红点
        menus.forEach(m => {
            if(/subscribe\/pages\/orders/i.test(m.url)) {
                setHasOrderLink(true);
            }
            else if(/shop\/pages\/orders/i.test(m.url)) {
                setHasShopOrderLink(true);
            }
        });
    }, []);

    useEffect(()=>{
        if(hasOrderLink && isLogin) {
            request.get("wxapp/subscribe/orders/tips", SERVICE_WINKT_ORDER_HEADER, null, true).then(res=>{
                //设置标签
                let statuses = res.data.data;
                menus.forEach(m=>{
                    //借阅链接
                    if(/subscribe\/pages\/orders/i.test(m.url)) {
                        let menuStatus = parseInt(m.url.split('=')[1]);
                        if(statuses['status-'+menuStatus]) {
                            m.badge = statuses['status-'+menuStatus];
                        }
                        else {
                            delete m.badge;
                        }
                    }
                });
                setMenus([...menus]);
            });
        }
    }, [hasOrderLink]);

    useDidShow(()=>{
        if(hasOrderLink && isLogin) {
            request.get("wxapp/subscribe/orders/tips", SERVICE_WINKT_ORDER_HEADER, null, true).then(res=>{
                //设置标签
                let statuses = res.data.data;
                menus.forEach(m=>{
                    //借阅链接
                    if(/subscribe\/pages\/orders/i.test(m.url)) {
                        let menuStatus = parseInt(m.url.split('=')[1]);
                        if(statuses['status-'+menuStatus]) {
                            m.badge = statuses['status-'+menuStatus];
                        }
                        else {
                            delete m.badge;
                        }
                    }
                });
                setMenus([...menus]);
            });
        }
        if(hasShopOrderLink && isLogin) {
            request.get("wxapp/shop/orders/tips", SERVICE_WINKT_ORDER_HEADER, null, true).then(res=>{
                //设置标签
                let statuses = res.data.data;
                menus.forEach(m=>{
                    //借阅链接
                    if(/shop\/pages\/orders/i.test(m.url)) {
                        let menuStatus = parseInt(m.url.split('=')[1]);
                        if(statuses['status-'+menuStatus]) {
                            m.badge = statuses['status-'+menuStatus];
                        }
                        else {
                            delete m.badge;
                        }
                    }
                });
                setMenus([...menus]);
            });
        }
    });


    useEffect(()=>{
        if(hasShopOrderLink && isLogin) {
            request.get("wxapp/shop/orders/tips", SERVICE_WINKT_ORDER_HEADER, null, true).then(res=>{
                //设置标签
                let statuses = res.data.data;
                menus.forEach(m=>{
                    //借阅链接
                    if(/shop\/pages\/orders/i.test(m.url)) {
                        let menuStatus = parseInt(m.url.split('=')[1]);
                        if(statuses['status-'+menuStatus]) {
                            m.badge = statuses['status-'+menuStatus];
                        }
                        else {
                            delete m.badge;
                        }
                    }
                });
                setMenus([...menus]);
            });
        }
    }, [hasShopOrderLink]);


    return (
        <View {...rest} style={style}>
            {basic.showTitle && <View style={{paddingLeft: '30rpx', borderBottom: '2rpx solid #f5f5f5', marginBottom: '10rpx'}}>
                <View className="text-lg margin-bottom-sm">{basic.title}</View>
            </View>}
            <View style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
                {menus.map((item: any, i:number) => {
                    return (
                        <View className={'margin-bottom-sm'} onClick={()=>util.gotoLink(item.url)} key={'menus'+index+''+i} style={{ width: 100 / parseInt(basic.columns) + '%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {item.badge && <View className='cu-tag badge' style={{top: Taro.pxTransform(7), right: Taro.pxTransform(10)}}>{item.badge}</View>}
                            <FallbackImage style={{...imageStyle}} mode={'aspectFit'} src={resolveUrl(item.image)} />
                            <View>{item.text}</View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

export default withLogin(MenusModule);
