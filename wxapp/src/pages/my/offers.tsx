import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import LoginView from "../../components/login";
import request from "../../lib/request";
import utils from "../../lib/utils";
import {View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import NoData from "../../components/nodata";
import LoadMore from "../../components/loadmore";
const numeral = require('numeral');

export default class Index extends Component<any, any> {
    state:any = {
        page: 1,
        list: [],
        loadingMore: false,
        noMore: false,
    }

    componentDidMount() {
    }

    loadData(page, clear = false) {
        return request.get('/paimai/api/members/offers', {params: {pageNo: page}}).then(res=>{
            if(clear) {
                this.setState({list: res.data.result.records, loadingMore: false, noMore: false});
            }
            else {
                let list = this.state.list;
                let newList = res.data.result.records;
                if(!newList || newList.length == 0) {
                    this.setState({noMore: true, loadingMore: false});
                }
                else {
                    this.setState({noMore: false, loadingMore:false, list: [...list, ...newList]});
                }
            }
        });
    }

    onLoad() {
        utils.showLoading();
        this.loadData(1,true).then(()=>utils.hideLoading());
    }

    onReachBottom() {
        this.setState({loadingMore: true, noMore: false});
        this.loadData(this.state.page+1,false).then(()=>{});
        this.setState({page: this.state.page+1});
    }

    onPullDownRefresh() {
        utils.showLoading();
        this.loadData(1,true).then(()=>utils.hideLoading());
        this.setState({page: 1});
    }

    render() {
        const {list, noMore, loadingMore} = this.state;
        return (
            <PageLayout statusBarProps={{title: '参拍记录'}} enableReachBottom={true}>
                <LoginView>
                    {list.length == 0 && <NoData />}
                    <View className={'grid grid-cols-1 gap-4 p-4'}>
                        {list.map((item)=>{
                            let radius = 0;
                            return (
                                <View className={'bg-white shadow-outer p-4 space-y-2'} style={{borderRadius: Taro.pxTransform(radius)}}>
                                    <View className={'flex items-center'}>
                                        <View className={'text-lg font-bold flex-1'}>{item.performanceName||item.goodsName}</View>
                                        <View className={'w-20 font-bold'}>
                                            ￥${numeral(item.price).format('0,0.00')}
                                        </View>
                                    </View>
                                    <View className={'text-gray-400 text-sm'}>
                                        交易单号:{item.transactionId}
                                        交易时间：{item.createTime}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                    {list.length > 0 && <LoadMore noMore={noMore} loading={loadingMore} />}
                </LoginView>
            </PageLayout>
        );
    }
}
