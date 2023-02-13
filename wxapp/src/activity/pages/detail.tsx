import PageLayout from "../../layouts/PageLayout";
import Taro, {useRouter, useShareAppMessage} from "@tarojs/taro";
import {useEffect, useState} from "react";
import request, {resolveUrl, SERVICE_WINKT_SYSTEM_HEADER} from "../../utils/request";
import {Button, Image, Text, View, Navigator, RichText} from "@tarojs/components";
import ContentLoading from "../../components/contentloading";
import moment from "moment";
import './detail.scss';


const ActivityDetail = () => {
    const [info, setInfo] = useState<any>();
    const [payed, setPayed] = useState<boolean>(false);
    const {params} = useRouter();

    useEffect(()=>{
        if(params.id) {
            request.get("wxapp/activities/"+params.id, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res=>{
                let detail = res.data.data;
                if (detail.content) {
                    detail.content = detail.content.replace(/<img /ig, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;" ');
                }
                setInfo(detail);
                //如果需要付费则需要支付后才能观看直播
                if(parseFloat(detail.price)>0) {
                    request.put("wxapp/activity/records/check/" + res.data.data.id, SERVICE_WINKT_SYSTEM_HEADER, null, true).then(res => {
                        if (res.data.data) {
                            setPayed(true);
                        }
                    });
                }
                else {
                    setPayed(true);
                }
            });
        }
    }, [params.id]);

    const gotoActivityUpload = (item:any) => {
        if(parseFloat(item.price) > 0) {
            Taro.showLoading({title: '支付中...'}).then();
            request.post("wxapp/activities/"+item.id, SERVICE_WINKT_SYSTEM_HEADER, null, true).then(res=>{
                let data = res.data.data;
                data.package = data.packageValue;
                Taro.requestPayment(data).then(() => {
                    //支付已经完成，提醒支付成功并返回上一页面
                    Taro.showToast({title: '微信支付成功', duration: 2000}).then(() => {
                        setPayed(true);
                        Taro.navigateTo({url: `upload?id=${item.id}`}).then();
                    });
                });
            })
        }
        else {
            Taro.navigateTo({url: `upload?id=${item.id}`}).then();
        }
    }
    const payActivityAndCanyu = (item:any) => {
        if(parseFloat(item.price) > 0) {
            Taro.showLoading({title: '支付中...'}).then();
            request.post("wxapp/activities/"+item.id, SERVICE_WINKT_SYSTEM_HEADER, null, true).then(res=>{
                let data = res.data.data;
                data.package = data.packageValue;
                Taro.requestPayment(data).then(() => {
                    //支付已经完成，提醒支付成功并返回上一页面
                    Taro.showToast({title: '微信支付成功', duration: 2000}).then(() => {
                        setPayed(true);
                        //报名活动
                        canyuActivity(item);
                    });
                }).catch(()=>{
                    Taro.hideLoading();
                });
            }).catch(()=>{
                Taro.hideLoading();
            })
        }
        else {
            Taro.navigateTo({url: `upload?id=${item.id}`}).then();
        }
    }
    const canyuActivity = (item:any) => {
        Taro.showLoading({title: '报名中...'}).then();
        request.put("wxapp/activities/"+item.id+"/canyu", SERVICE_WINKT_SYSTEM_HEADER, null, true).then(()=>{
            Taro.showToast({title: '报名成功', duration: 2000}).then(() => {
            });
        }).catch(()=>Taro.hideLoading());
    }
    useShareAppMessage(() => {
        return { title: info?.name };
    })
    if(!info) {
        return <ContentLoading height={'calc(100vh - 140rpx)'} />
    }
    const nowTime = moment().valueOf();
    const notStarted = info.startAt > nowTime;
    const liveing = info.startAt < nowTime && info.endAt > nowTime;
    const ended = info.endAt < nowTime;
    const requirePay = liveing && !payed;

    const renderButton = () => {
        if(info.type < 3) {
            if (requirePay) {
                return <Button style={{width: '100%'}} type={'primary'}
                               className={'cu-btn bg-orange xl block no-radius'}
                               onClick={() => gotoActivityUpload(info)}>支付并参与活动</Button>;
            } else if (notStarted) {
                return <Button style={{width: '100%'}} disabled={true}
                               className={'cu-btn bg-orange xl block no-radius'}>活动尚未开始</Button>;
            } else if (liveing) {
                return <View className={'flex'} style={{width: '100%'}}>
                    <Navigator className={'cu-btn bg-blue xl block no-radius flex-sub'}
                               url={`works?id=${info.id}`}>查看作品</Navigator>
                    <Navigator className={'cu-btn bg-green xl block no-radius flex-sub'}
                               url={`upload?id=${info.id}`}>上传作品</Navigator>
                </View>
            } else if (ended) {
                return <Navigator className={'cu-btn bg-blue xl block no-radius flex-sub'}
                                  url={`works?id=${info.id}`}>查看作品</Navigator>;
            }
        }
        else {
            if (requirePay) {
                return <Button style={{width: '100%'}} type={'primary'}
                               className={'cu-btn bg-orange xl block no-radius'}
                               onClick={() => payActivityAndCanyu(info)}>支付并参与活动</Button>;
            } else if (notStarted) {
                return <Button style={{width: '100%'}} disabled={true}
                               className={'cu-btn bg-orange xl block no-radius'}>活动尚未开始</Button>;
            } else if (liveing) {
                return <Button style={{width: '100%'}} type={'primary'}
                               className={'cu-btn bg-orange xl block no-radius'}
                               onClick={() => canyuActivity(info)}>参与活动</Button>;
            } else if (ended) {
                return <Navigator className={'cu-btn bg-blue xl block no-radius flex-sub'}
                                  url={`works?id=${info.id}`}>查看作品</Navigator>;
            }
        }
        return <></>
    }

    return (
        <PageLayout showTabBar={false} statusBarProps={{title: '活动详情'}} loading={!info} className={'bg-white'}>
            <Image src={resolveUrl(info?.image)} style={{width: '100%'}} mode={'widthFix'} />
            <View className={'padding text-lg text-bold text-black flex justify-between'}>
                <View>{info.name}</View>
                {notStarted && <View className={'text-orange'}>距离开始：</View>}
                {liveing && <View className={'text-green'}>活动进行中</View>}
                {ended && <View className={'text-gray'}>活动已结束</View>}
            </View>
            <View className={'padding-left padding-right flex align-center justify-between'}>
                {info.type == 1 && <Text className={'cu-tag line-green'}>图文类</Text>}
                {info.type == 2 && <Text className={'cu-tag line-orange'}>视频类</Text>}
                {info.type == 3 && <Text className={'cu-tag line-blue'}>报名类</Text>}
                {info.type < 3 && <Navigator url={`works?id=${info.id}`}>查看作品</Navigator>}
            </View>
            <View className="margin-top bg-white padding" style={{paddingBottom: Taro.pxTransform(80)}}>
                <View className='text-center text-lg text-black margin-bottom-sm text-bold'>活动详情</View>
                <RichText nodes={info.content} space={'nbsp'} />
            </View>
            <View className={'cu-bar tabbar'} style={{position: 'fixed', bottom: 0, width: '100%'}}>
                {renderButton()}
            </View>
        </PageLayout>
    );
}

export default ActivityDetail;
