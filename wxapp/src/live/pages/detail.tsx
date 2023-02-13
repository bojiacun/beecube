import PageLayout from "../../layouts/PageLayout";
import Taro, {useDidShow, useRouter, useShareAppMessage, useShareTimeline} from "@tarojs/taro";
import {useState} from "react";
import request, {resolveUrl, SERVICE_WINKT_LIVE_HEADER} from "../../utils/request";
import {Button, Image, OfficialAccount, Text, View} from "@tarojs/components";
import ContentLoading from "../../components/contentloading";
import moment from "moment";
import './detail.scss';
import withLogin from "../../components/login/login";


const LiveDetail = (props) => {
    const {makeLogin, checkLogin} = props;
    const [info, setInfo] = useState<any>();
    const [payed, setPayed] = useState<boolean>(false);
    const {params} = useRouter();
    const isLogined = checkLogin();

    useDidShow(()=>{
        if(params.id) {
            request.get("wxapp/lives/"+params.id, SERVICE_WINKT_LIVE_HEADER, null, false).then(res=>{
                setInfo(res.data.data);
                //如果需要付费则需要支付后才能观看直播
                if(parseFloat(res.data.data.price)>0) {
                    request.get("wxapp/lives/checkpay/" + res.data.data.id, SERVICE_WINKT_LIVE_HEADER, null, true).then(res => {
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
    })

    const gotoLiveDetail = (item:any) => {
        if(parseFloat(item.price) > 0) {
            Taro.showLoading({title: '支付中...'}).then();
            request.post("wxapp/lives/"+item.id, SERVICE_WINKT_LIVE_HEADER, null, true).then(res=>{
                let data = res.data.data;
                data.package = data.packageValue;
                Taro.requestPayment(data).then(() => {
                    //支付已经完成，提醒支付成功并返回上一页面
                    Taro.showToast({title: '微信支付成功', duration: 2000}).then(() => {
                        Taro.navigateTo({url: `room?id=${item.id}`}).then();
                    });
                });
            })
        }
        else {
            Taro.navigateTo({url: `room?id=${item.id}`}).then();
        }
    }
    useShareAppMessage(() => {
        return {
            title: info.name,
            path: '/live/pages/detail?id=' + info.id,
        }
    });

    useShareTimeline(()=>{
        return {
            title: info.name,
        };
    });



    if(!info) {
        return <ContentLoading height={'calc(100vh - 140rpx)'} />
    }
    const nowTime = moment().valueOf();
    const notStarted = info.startAt > nowTime;
    const liveing = info.startAt < nowTime && info.endAt > nowTime && info.liveStatus == 1;
    const ended = info.endAt < nowTime;
    const requirePay = liveing && !payed;


    const entryRoom = () => {
        if(info.orientation == 'vertical') {
            Taro.navigateTo({url: `room_vertical?id=${info.id}`}).then();
        }
        else {
            Taro.navigateTo({url: `room?id=${info.id}`}).then();
        }
    }

    const renderButton = () => {
        if(!isLogined) {
            return <Button style={{width: '100%'}} type={'primary'} className={'cu-btn bg-orange lg block no-radius'} onClick={makeLogin}>点击授权登录</Button>;
        }
        if(requirePay) {
            return <Button style={{width: '100%'}} type={'primary'} className={'cu-btn bg-orange lg block no-radius'} onClick={()=>gotoLiveDetail(info)}>支付观看直播</Button>;
        }
        else if(notStarted) {
            return <Button style={{width: '100%'}} disabled={true} className={'cu-btn bg-orange lg block no-radius'}>直播尚未开始</Button>;
        }
        else if(liveing) {
            return <Button style={{width: '100%'}} onClick={entryRoom} className={'cu-btn bg-green lg block no-radius'}>进入直播间</Button>
        }
        else if(ended) {
            return <Button style={{width: '100%'}} disabled={true} className={'cu-btn bg-orange lg block no-radius'}>直播已结束</Button>;
        }
        return <></>
    }
    return (
        <PageLayout showTabBar={false} statusBarProps={{title: '直播详情'}} loading={!info} className={'bg-white'}>
            <Image src={resolveUrl(info?.image)} style={{width: '100%'}} mode={'widthFix'} />
            <View className={'padding text-lg text-bold text-black flex justify-between'}>
                <View>{info.name}</View>
                {notStarted && <View className={'text-orange'}>开播时间：<Text>{moment(info.startAt).format('MM-DD HH:mm')}</Text></View>}
                {liveing && <View className={'text-green'}>直播中</View>}
                {ended && <View className={'text-gray'}>直播已结束</View>}
            </View>
            <View className={'padding-left padding-right flex align-center justify-between'}>
                <View className='flex align-center'>
                    {info.room.memberAvatar && <View className='cu-avatar sm round marign-right-xs' style={{backgroundImage: `url(${info.room.memberAvatar})`}} />}
                    <Text> {info.room.name} </Text>
                </View>
                <View><Text className='cuIcon-attention margin-right-xs' />{info.memberCount}</View>
            </View>
            <View className={'padding'}>{info.description}</View>

            <View style={{height: '140rpx'}} />

            <OfficialAccount />
            <View className={'cu-bar tabbar'} style={{bottom: 0, width: '100%'}}>
                {renderButton()}
            </View>
        </PageLayout>
    );
}

export default withLogin(LiveDetail);
