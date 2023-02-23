import { View,Image,Navigator } from "@tarojs/components";
import withLogin from "../../../../components/login/login";
import {useEffect, useState} from "react";
import request, {API_SITES_INFO, SERVICE_WINKT_SYSTEM_HEADER} from "../../../../utils/request";



const CurrentSiteModule = (props: any) => {
    const { index, data, style, basic, context, dispatch, ...rest } = props;
    const {userInfo} = context;
    const [site, setSite] = useState<any>();

    useEffect(()=>{
        if(userInfo?.memberInfo?.siteId) {
            request.get(API_SITES_INFO + "/" + userInfo.memberInfo.siteId, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res => {
                setSite(res.data.data);
            });
        }
    }, [userInfo?.memberInfo?.siteId])

    if(!site) {
        return <></>
    }
    return (
        <View {...rest} style={{...style, display: 'flex'}}>
            <View style={{position: 'relative', flex: 1, backgroundColor: '#f5f5f5', display: 'flex', borderRadius: '20rpx', overflow: 'hidden'}}>
                <View className={'triangle-topleft'} style={{position: 'absolute', left: 0, top: 0}} />
                <View className={'text-sm bg-green text-center padding-top-xl padding-left-xs padding-right-xs'} style={{width: '60rpx'}}>我的书店</View>
                <View className={'margin-left-xl margin-right'} style={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column', justifyContent: 'center'}}>
                    <View className="text-xl text-black margin-bottom-xs">{site?.name}</View>
                    <View className='text-sm text-gray'>地址：{site?.address}</View>
                </View>
            </View>
            <Navigator url='/subscribe/pages/orders' style={{padding: '30rpx 60rpx', background: basic.buttonBackground, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 10, borderRadius: 10, flexDirection: 'column'}}>
                <Image src={'../../assets/images/designer/wodejieyue.png'} style={{width: '100rpx', height: '90rpx'}} />
                <View>我的借阅</View>
            </Navigator>
        </View>
    );
}

export default withLogin(CurrentSiteModule);
