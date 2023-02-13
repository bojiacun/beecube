import { View,Image} from "@tarojs/components";
import {useEffect, useState} from "react";
import request, {
    resolveUrl,
    SERVICE_WINKT_LIVE_HEADER,
} from "../../../../utils/request";
import { searchLives } from "./service";
import Taro, {useDidShow} from '@tarojs/taro';



const LiveHistoryListModule = (props: any) => {
    const { index, style, basic, ...rest } = props;
    const [liveList, setLiveList] = useState<any[]>([]);

    useEffect(()=>{
        searchLives(0).then(res=>setLiveList(res));
    }, []);

    useDidShow(()=>{
        searchLives(0).then(res=>setLiveList(res));
    });

    const gotoLiveDetail = (item:any) => {
        Taro.showLoading({title: '打开中...'}).then();
        if(parseFloat(item.price) > 0) {
            //如果需要付费则需要支付后才能观看直播
            request.get("wxapp/lives/checkpay/"+item.id, SERVICE_WINKT_LIVE_HEADER, null, true).then(res=>{
                if(res.data.data) {
                    Taro.navigateTo({url: `/live/pages/video?id=${item.id}`}).then();
                    Taro.hideLoading();
                }
                else {
                    Taro.showLoading({title: '创建订单...'}).then();
                    request.post("wxapp/lives/"+item.id, SERVICE_WINKT_LIVE_HEADER, null, true).then(res=>{
                        let data = res.data.data;
                        data.package = data.packageValue;
                        Taro.requestPayment(data).then(() => {
                            //支付已经完成，提醒支付成功并返回上一页面
                            Taro.showToast({title: '微信支付成功', duration: 2000}).then(() => {
                                Taro.navigateTo({url: `/live/pages/video?id=${item.id}`}).then();
                            });
                        });
                    })
                }
            });
        }
        else {
            Taro.navigateTo({url: `/live/pages/video?id=${item.id}`}).then();
            Taro.hideLoading();
        }
    }

    return (
        <View {...rest} style={style}>
            {basic.titleType == 1&&
                <View style={{
                    position: 'relative',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image src={'../../assets/images/designer/biaoqian.png'} mode={'widthFix'} style={{ display: 'block', width: '50%', position: 'absolute', zIndex: 0 }} />
                    <View className='text-lg' style={{ zIndex: 1, fontSize: basic.fontSize, marginBottom: Taro.pxTransform(20) }}>{basic.title}</View>
                </View>
            }
            {basic.titleType == 2 &&
                <View style={{
                    position: 'relative',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Image mode={'widthFix'} src={resolveUrl(basic.titleimg)} style={{display: 'block', width: basic.titleimgWidth+'%', marginBottom: basic.titleBottomMargin, marginTop: basic.titleTopMargin}} />
                </View>
            }

            <View style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                {liveList.slice(0, basic.count).map((item: any) => {
                    let itemWidth = basic.space;
                    itemWidth = 'calc((100% - ' + itemWidth + 'px) / 2)';
                    return (
                        <View onClick={()=>gotoLiveDetail(item)} key={item.id} style={{
                            width: itemWidth,
                            background: 'white',
                            padding: Taro.pxTransform(10),
                            marginBottom: Taro.pxTransform(basic.space),
                            borderRadius: basic.itemBorderRadius,
                            position: 'relative'
                        }}>
                            {item.isMemberPrivate && <View style={{
                                backgroundColor: '#ff5454',
                                padding: '0 10rpx',
                                color: 'white',
                                position: 'absolute',
                                left: Taro.pxTransform(10),
                                top: Taro.pxTransform(20),
                                zIndex: 1,
                                borderTopRightRadius: 8,
                                borderBottomRightRadius: 8
                            }}>会员专享</View>}
                            <View style={{paddingTop: '100%', width: '100%', position: 'relative'}}>
                                <Image src={resolveUrl(item.poster??item.image)} style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    display: 'block',
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    zIndex: 99
                                }}/>
                            </View>
                            <View style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                marginBottom: 0,
                                lineHeight: 2
                            }}>{item.name}</View>
                            <View style={{fontSize: Taro.pxTransform(12), display: 'flex'}}>
                            </View>
                        </View>
                    );
                })}
            </View>

        </View>
    );
}

export default LiveHistoryListModule;
