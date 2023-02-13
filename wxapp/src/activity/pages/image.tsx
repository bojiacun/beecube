import {Image, Text, View} from "@tarojs/components";
import Taro, {useRouter, useShareAppMessage} from "@tarojs/taro";
import {useEffect, useState} from "react";
import request, {resolveUrl, SERVICE_WINKT_SYSTEM_HEADER} from "../../utils/request";
import PageLayout from "../../layouts/PageLayout";
import withLogin from "../../components/login/login";


const PreviewImage = (props:any) => {
    const {makeLogin, checkLogin} = props;
    const [info, setInfo] = useState<any>();
    const [liked, setLiked] = useState<boolean>(false);
    const {params} = useRouter();

    const isLogin = checkLogin();

    const loadData = () => {
        request.get("wxapp/activity/records/" + params.id, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res => setInfo(res.data.data));
        if(isLogin) {
            request.get("wxapp/activity/records/islikes/"+params.id, SERVICE_WINKT_SYSTEM_HEADER, null, true).then(res=>{
                if(res.data.data) {
                    setLiked(true);
                }
                else {
                    setLiked(false);
                }
            });
        }
    }
    useShareAppMessage(() => {
        return { title: info?.activity.name };
    });
    useEffect(() => {
        Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: '#000000'}).then();
        loadData();
    }, []);

    const doZan = () => {
        makeLogin(()=>{
            request.put("wxapp/activity/records/likes/"+info.id, SERVICE_WINKT_SYSTEM_HEADER, null, true).then(()=>{
                loadData();
            });
            request.get("wxapp/activity/records/islikes/"+params.id, SERVICE_WINKT_SYSTEM_HEADER, null, true).then(res=>{
                if(res.data.data) {
                    setLiked(true);
                }
                else {
                    setLiked(false);
                }
            });
        });
    }

    return (
        <PageLayout showTabBar={false} statusBarProps={{bgColor: 'transparent', position: 'fixed', top: 0, left: 0}}>
            <View className={'bg-black'} style={{width: '100vw', height: '100vh'}}>
                {info && <Image src={resolveUrl(info?.attachment)} mode={'aspectFit'} style={{width: '100vw', height: '100vh'}}/>}
                {info &&
                    <View style={{ position: 'fixed', bottom: 0, marginBottom: Taro.pxTransform(50), width: '100%'}}>
                        <View className={'bg-black'} style={{opacity: 0.4, left: 0, right: 0, bottom: 0, top: 0, zIndex: -1, position: 'absolute'}} />
                        <View className={'flex justify-between text-lg padding'}>
                            <Text>{info?.title}</Text>
                            {!liked && <View onClick={doZan}><Text className={'cuIcon-like margin-right-xs'} />{info.likes}</View>}
                            {liked && <View onClick={doZan}><Text className={'cuIcon-likefill margin-right-xs text-red'} />{info.likes}</View>}
                        </View>
                    </View>
                }
            </View>
        </PageLayout>
    );
}

export default withLogin(PreviewImage);
