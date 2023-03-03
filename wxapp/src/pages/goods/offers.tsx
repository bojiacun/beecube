import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import LoginView from "../../components/login";
import request from "../../lib/request";
import utils from "../../lib/utils";
import {View} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
import Taro from "@tarojs/taro";
import NoData from "../../components/nodata";
const numeral = require('numeral');

export default class Index extends Component<any, any> {
    state:any = {
        page: 1,
        offers: [],
        id: '',
    }

    componentDidMount() {
    }

    loadData(id, page, clear = false) {
        return request.get('/paimai/api/goods/offers', {params: {id: id, page: page}}).then(res=>{
            if(clear) {
                this.setState({offers: res.data.result.records});
            }
            else {
                let offers = this.state.offers;
                offers.push(res.data.result.records);
                this.setState({offers: offers});
            }
        });
    }

    onLoad(options) {
        utils.showLoading();
        this.setState({id: options.id});
        this.loadData(options.id, 1,true).then(()=>utils.hideLoading());
    }

    onReachBottom() {
        this.loadData(this.state.id, this.state.page+1,false).then(()=>{});
        this.setState({page: this.state.page+1});
    }

    onPullDownRefresh() {
        utils.showLoading();
        this.loadData(this.state.id, 1,true).then(()=>utils.hideLoading());
        this.setState({page: 1});
    }

    render() {
        const {offers} = this.state;
        return (
            <PageLayout statusBarProps={{title: '出价记录'}}>
                <LoginView>
                    <View className={'space-y-4 p-4'}>
                        {offers.length == 0 && <NoData />}
                        {offers.map((o,index)=>{
                            return (
                                <View className={'flex justify-between items-center bg-white rounded-full overflow-hidden p-1 shadow-outer'}>
                                    <View className={'flex items-center space-x-2'}>
                                        <FallbackImage src={o.memberAvatar} className={'rounded-full'} style={{width: Taro.pxTransform(52), height: Taro.pxTransform(52)}} />
                                        <View>
                                            <View>{o.memberName}</View>
                                            <View className={'font-bold'}>￥{numeral(o.price).format('0,0.00')}</View>
                                        </View>
                                    </View>
                                    <View className={'text-right pr-4'}>
                                        {index == 0 && <View className={'text-indigo-600 font-bold'}>领先</View>}
                                        {index != 0 && <View className={'font-bold text-gray-400'}>出局</View>}
                                        <View className={'text-sm text-gray-400'}>{o.offerTime}</View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </LoginView>
            </PageLayout>
        );
    }
}
