import { View,Image,Text} from "@tarojs/components";
import {useEffect, useState} from "react";
import request, {
    resolveUrl,
    SERVICE_WINKT_LIVE_HEADER,
} from "../../../../utils/request";
import util from "../../../../utils/we7/util";
import { searchLives } from "./service";
import classNames from "classnames";
import Taro, {useDidShow} from '@tarojs/taro';



const LiveListModule = (props: any) => {
    const { index, style, basic, ...rest } = props;
    const [liveList, setLiveList] = useState<any[]>([]);
    let tagColors = ['red', 'orange', 'green', 'yellow', 'gray'];

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
                    Taro.navigateTo({url: `/live/pages/detail?id=${item.id}`}).then();
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
                                Taro.navigateTo({url: `/live/pages/detail?id=${item.id}`}).then();
                            });
                        });
                    })
                }
            });
        }
        else {
            Taro.navigateTo({url: `/live/pages/detail?id=${item.id}`}).then();
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
                    <Image src={'../../assets/images/designer/biaoqian.png'} mode={"widthFix"} style={{ display: 'block', width: '50%', position: 'absolute', zIndex: 0 }} />
                    <View className='text-lg' style={{ zIndex: 1, fontSize: util.px2rpx(basic.fontSize), marginBottom: util.px2rpx(20) }}>{basic.title}</View>
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
                    <Image mode='widthFix' src={resolveUrl(basic.titleimg)} style={{display: 'block', width: basic.titleimgWidth+'%', marginBottom: basic.titleBottomMargin, marginTop: basic.titleTopMargin}} />
                </View>
            }
            {
                liveList.slice(0, basic.count).map((item: any, index: number) => {
                    return (
                        <View key={item.id} style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '20rpx 30rpx', marginLeft: util.px2rpx(basic.space), marginRight: util.px2rpx(basic.space), marginBottom: util.px2rpx(index == liveList.length - 1 ?0:basic.space), borderRadius: util.px2rpx(basic.itemBorderRadius), position: 'relative' }}>
                            <View style={{width: util.px2rpx(80), marginRight: util.px2rpx(15)}}>
                                <Image src={resolveUrl(item.image)} mode={'widthFix'} style={{ display: 'block', width: '100%', height: util.px2rpx(80), objectFit: 'cover' }} />
                            </View>
                            <View style={{flex: 1}}>
                                <View style={{fontSize: util.px2rpx(12), display: 'flex', alignItems: 'center'}}>
                                    {item.isHot && <Text style={{ backgroundColor: '#faead5', color: '#fb9d0f', marginRight: util.px2rpx(10), padding: '0 10rpx', borderBottomRightRadius: util.px2rpx(5), borderTopLeftRadius: util.px2rpx(5)}}>热门</Text>}
                                    {item.isSugguest && <Text style={{ backgroundColor: '#dbece4', color: '#2c9940', marginRight: util.px2rpx(10), padding: '0 10rpx', borderBottomRightRadius: util.px2rpx(5), borderTopLeftRadius: util.px2rpx(5)}}>推荐</Text>}
                                    <View className='text-lg' style={{ whiteSpace: 'nowrap', fontSize: util.px2rpx(16), overflow: 'hidden', marginBottom: 0, lineHeight: 2, display: 'inline-block' }}>{item.name}</View>
                                </View>
                                <View style={{fontSize: util.px2rpx(12), marginBottom: util.px2rpx(35)}}>
                                    {item.tags?.split(',').map((tag:string, index: number)=>{
                                        return <Text className={classNames('cu-tag round text-sm line-'+tagColors[index])} style={{height: 'auto'}}>{tag}</Text>
                                    })}
                                </View>
                                <View style={{color: 'gray'}}><Text style={{}}>{item.memberCount}</Text> 人次观看</View>
                            </View>
                            <View onClick={()=>gotoLiveDetail(item)} style={{backgroundColor: '#ffba16', borderRadius: util.px2rpx(15), position: 'absolute', right: util.px2rpx(15), bottom: util.px2rpx(15), border: 'none', padding: '10rpx 40rpx'}}>
                                <Text className='cuIcon-playfill' style={{marginRight: util.px2rpx(5)}} />立即观看
                            </View>
                        </View>
                    );
                })
            }

        </View>
    );
}

export default LiveListModule;
