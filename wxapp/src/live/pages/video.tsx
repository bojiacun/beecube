import {Text, Video, View} from "@tarojs/components";
import Taro, {useRouter} from "@tarojs/taro";
import {useEffect, useState} from "react";
import request, {resolveUrl, SERVICE_WINKT_LIVE_HEADER} from "../../utils/request";
import PageLayout from "../../layouts/PageLayout";


const PreviewVideo = () => {
    const [info, setInfo] = useState<any>();
    const {params} = useRouter();

    const loadData = () => {
        request.get("wxapp/lives/" + params.id, SERVICE_WINKT_LIVE_HEADER, null, false).then(res => setInfo(res.data.data));
    }

    useEffect(() => {
        Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: '#000000'}).then();
        loadData();
    }, []);

    return (
        <PageLayout showTabBar={false} statusBarProps={{bgColor: 'transparent', position: 'fixed', top: 0, left: 0}}>
            <View className={'bg-black'} style={{width: '100vw', height: '100vh'}}>
                <Video autoplay={true} controls={true} src={resolveUrl(info?.historyPlayAddress)}
                       style={{width: '100vw', height: '100vh'}} objectFit='contain'/>
                {info &&
                    <View style={{ position: 'fixed', bottom: 0, marginBottom: Taro.pxTransform(50), width: '100%'}}>
                        <View className={'bg-black'} style={{opacity: 0.4, left: 0, right: 0, bottom: 0, top: 0, zIndex: -1, position: 'absolute'}} />
                        <View className={'flex justify-between text-lg padding'}>
                            <Text>{info?.title}</Text>
                        </View>
                    </View>
                }
            </View>
        </PageLayout>
    );
}

export default PreviewVideo;
