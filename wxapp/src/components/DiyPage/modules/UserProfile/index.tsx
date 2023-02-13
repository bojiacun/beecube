import { View, Navigator } from "@tarojs/components";
import withLogin from "../../../login/login";
import {useEffect, useState} from "react";
import request, {SERVICE_WINKT_SYSTEM_HEADER} from "../../../../utils/request";
import {useDidShow} from "@tarojs/taro";


const UserProfileModule = (props: any) => {
    const { index, style, basic, makeLogin, context, ...rest } = props;
    const {userInfo} = context;
    const [couponCount, setCouponCount] = useState<number>(0);

    const loadData = () => {
        if(userInfo) {
            request.get("wxapp/coupons/tickets/count", SERVICE_WINKT_SYSTEM_HEADER, null, true).then(res=>{
                setCouponCount(res.data.data);
            })
        }
    }

    useDidShow(()=>{
        loadData();
    });

    useEffect(()=>{
        loadData();
    },[])


    return (
        <View {...rest} style={style}>
            <View className='padding-top-sm' style={{display: 'flex', justifyContent: 'space-around', justifyItems: 'center', textAlign: 'center'}}>
                <Navigator url='/pages/my/score_record'>
                    <View className="text-lg" style={{marginBottom: 0}}>{userInfo?.memberInfo.score||0}</View>
                    <View style={{marginBottom: 0}}>大小豆</View>
                    <View className="text-sm" style={{marginBottom: 0, color: '#999999'}}>借阅领豆</View>
                </Navigator>
                <Navigator url='/pages/my/coupons'>
                    <View className="text-lg"  style={{marginBottom: 0}}>{couponCount}</View>
                    <View style={{marginBottom: 0}}>优惠券</View>
                    <View className="text-sm" style={{marginBottom: 0, color: '#999999'}}>下单立省</View>
                </Navigator>
                <Navigator url='/pages/my/wallet_water'>
                    <View className="text-lg" style={{marginBottom: 0}}>{userInfo?.memberInfo.money||0}</View>
                    <View style={{marginBottom: 0}}>余额</View>
                    <View className="text-sm" style={{marginBottom: 0, color: '#999999'}}>会场通用</View>
                </Navigator>
            </View>

        </View>
    );
}

export default withLogin(UserProfileModule);
