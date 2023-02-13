import Taro, {useRouter} from "@tarojs/taro";
import {useEffect, useState} from "react";
import request, {
    API_SITES_INFO,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
import PageLayout from "../../layouts/PageLayout";
import {Button, Map, Text, View} from "@tarojs/components";
import moment from "moment";
import IconFont from "../../components/iconfont";


const SiteDetailPage = () => {
    const [site, setSite] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const {params} = useRouter();
    let checkTimer;
    const loadData = () => {
        if(params.id) {
            Taro.showLoading({title: '加载中...'}).then();
            request.get(API_SITES_INFO+"/"+params.id, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res=>{
                let _site = res.data.data;
                _site.borrowNotice = _site.borrowNotice.replace(/<img /ig, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;" ');
                setSite(_site);
                setLoading(false);
                Taro.hideLoading();
            })
        }
    }

    const startNavigation = (site) => {
        Taro.openLocation({latitude: site.lat, longitude: site.lng}).then();
    }
    useEffect(()=>{
        loadData();
        return () => {
            clearInterval(checkTimer);
        }
    }, []);


    return (
        <PageLayout showStatusBar={true} statusBarProps={{title: '门店详情'}} showTabBar={false}>
            {site && !loading &&
                <View className="bg-white" style={{minHeight: '100vh'}}>
                    <Map
                        latitude={site?.lat}
                        longitude={site?.lng}
                        style={{width: '100%', height: Taro.pxTransform(350), display: 'block'}}
                        markers={[
                            {
                                id: 1,
                                latitude: site?.lat,
                                longitude: site?.lng,
                                iconPath: '../../assets/images/user/address.png',
                                width: 32,
                                height: 32,
                                // @ts-ignore
                                callout: {
                                    content: site.name,
                                    display: 'ALWAYS',
                                    padding: 10,
                                    fontSize: 14
                                }
                            }
                        ]}
                    />
                    <View className="padding-left padding-right margin-top flex align-center"
                          style={{position: 'relative'}}>
                        <Text className="text-black text-bold text-xl margin-right">{site.name}</Text>
                        {site.status == 1 && (!!site.endAt || (!!site.endAt && site.endAt < moment().valueOf())) ?
                            <Text className="cu-tag line-green round">正常营业</Text> :
                            <Text className="cu-tag line-red round">暂停服务中</Text>}
                        <View style={{position: 'absolute', right: 10, top: 0}} onClick={() => startNavigation(site)}>
                            <IconFont name={'daohang'} size={32} color={'blue'} />
                        </View>
                    </View>
                    <View className="padding-left padding-right margin-top flex align-center text-lg">
                        <View className="margin-right-sm"><Text className="cuIcon-deliver"/></View>
                        <View>{site.address}</View>
                    </View>
                    <View className="padding-left padding-right margin-top flex align-center text-lg">
                        <Text className="cuIcon-mobilefill text-red"/>
                        {site.contactor}
                        <Button className="cu-btn bg-gradual-blue round margin-left-sm"
                                onClick={() => Taro.makePhoneCall({phoneNumber: site.contact})}>拨打电话</Button>
                    </View>
                </View>
            }
        </PageLayout>
    );
}

export default SiteDetailPage;
