import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import PageLoading from "../../components/pageloading";
import {Button, Navigator, Text, View} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import Taro from "@tarojs/taro";
import {connect} from "react-redux";

// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context,
        message: state.message
    }
))
export default class Index extends Component<any, any> {
    state: any = {
        id: null,
        detail: null,
        invited: null,
    }

    onLoad(options) {
        Taro.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: '#9e2323'});
        this.setState({id: options.id});
        request.get('/paimai/api/performances/detail', {params: {id: options.id}}).then(res => {
            let detail = res.data.result;
            this.setState({detail: detail});
            request.get('/paimai/api/members/invites', {params: {id: options.id}}).then(res => {
                this.setState({invited: res.data.result});
            })
        });
    }
    onShareAppMessage() {
        let mid = this.props.context?.userInfo?.id || '';
        return {
            title: '您的朋友邀请您一起参加'+this.state.detail.title,
            path: '/pages/performance/invite?id=' + this.state.detail.id + '&mid=' + mid
        }
    }
    render() {
        const {detail, invited} = this.state;
        if (!detail || !invited) return <PageLoading/>;

        const codes = invited.inviteCode.split('');

        return (
            <PageLayout style={{backgroundColor: '#9e2323'}} statusBarProps={{
                title: '预展参观凭证',
                style: {background: 'transparent', color: 'white', fontWeight: 'bold', fontSize: 16}
            }}>
                <View className={'m-4 relative spikes'}>
                    <FallbackImage src={utils.resolveUrl(detail.preview)} mode={'widthFix'}
                                   className={'block w-full box-border rounded-t-lg overflow-hidden'}/>
                    <View className={'p-4 space-y-4 bg-white'}>
                        <View className={'text-lg font-bold'}>{detail.title}</View>
                        <View className={'space-x-4 text-sm text-gray-500'}>
                            <Text className={''}>拍卖地点</Text>
                            <Text>{detail.auctionAddress}</Text>
                        </View>
                        <View className={'space-x-4 text-gray-500 text-sm'}>
                            <Text className={''}>拍卖时间</Text>
                            <Text>{detail.auctionTimeRange || detail.startTime}</Text>
                        </View>
                        <View className={'p-4 border-gray-200 bg-red-100 rounded-lg'}>
                            <Navigator className={'flex justify-between items-center'}
                                       url={'/pages/performance/detail' + (detail.type == 2 ? '2' : '') + '?id=' + detail.id}>
                                <View className={'title1'}>
                                    <Text>线上同步拍专场</Text>
                                </View>
                                <Text className={'font-bold iconfont icon-youjiantou_huaban text-red-600'}/>
                            </Navigator>
                        </View>
                    </View>
                    <View className={'flex items-center bg-white'}>
                        <View style={{backgroundColor: '#9e2323', width: 20, height: 20, marginLeft: -10}}
                              className={'rounded-full'}></View>
                        <View className={'flex-1 mx-4'} style={{borderBottom: '2px dashed #ccc', height: 1}}></View>
                        <View style={{backgroundColor: '#9e2323', width: 20, height: 20, marginRight: -10}}
                              className={'rounded-full'}></View>
                    </View>

                    <View className={'p-4 bg-white'}>
                        <View className={'text-red-600 text-center font-bold text-lg'}>预占参观码</View>
                        <View className={'flex flex-nowrap  h-30 items-center justify-around'}>
                            {codes.map((code) => {
                                return (
                                    <View
                                        className={'flex-none text-4xl font-bold text-gray-800 bg-gray-200 rounded-lg px-4 py-2'}>{code}</View>
                                );
                            })}
                        </View>
                        <View className={'text-sm p-4 text-gray-400'}>
                            <Text className={'fa fa-info-circle'}></Text>
                            凭有效参展码才可参观本次拍卖会预展，请保管好您的参观码，建议您提前截屏保存到手机相册中
                        </View>
                    </View>
                </View>


                <View className={'p-4'}>
                    <Button openType={'share'} style={{display: 'flex'}} className={'btn text-lg w-full btn-danger font-bold text-white items-center justify-center'}><Text className={'fa mr-2 fa-share-square-o'} style={{fontSize: 22}}></Text>邀请好友一起参展</Button>
                </View>
            </PageLayout>
        );
    }
}
