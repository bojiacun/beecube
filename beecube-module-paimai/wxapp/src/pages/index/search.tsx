import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Input, Navigator, Text, View} from "@tarojs/components";
import { debounce } from 'throttle-debounce';
import request from "../../lib/request";
import utils from "../../lib/utils";
import LineTitle from "../../components/LineTitle";
import Taro from "@tarojs/taro";
import FallbackImage from "../../components/FallbackImage";
import listStyle from "../performance/list.module.scss";
import classNames from "classnames";
import TimeCountDowner, {TimeCountDownerMode} from "../../components/TimeCountDowner";
import NoData from "../../components/nodata";

const numeral = require('numeral');


export default class Index extends Component<any, any> {
    state: any = {
        goodsList: [],
        performanceList: [],
    }
    searchHandler:any;
    constructor(props) {
        super(props);
        this.handleInputSearch = this.handleInputSearch.bind(this);
        this.renderGoods = this.renderGoods.bind(this);
        this.renderPerformance = this.renderPerformance.bind(this);
        this.doSearch = this.doSearch.bind(this);
        this.searchHandler = debounce(1000, this.doSearch);
    }
    doSearch(key: string) {
        utils.showLoading();
        Promise.all([
            request.get('/paimai/api/goods/list', {params: {key:key, type: 1}}),
            request.get('/paimai/api/performances/list', {params: {key:key}})
        ]).then((reses:any)=>{
            utils.hideLoading();
            this.setState({goodsList: reses[0].data.result.records, performanceList: reses[1].data.result.records});
        });
    }
    renderGoods(item) {
        let radius = 0;
        return (
            <View className={'bg-white relative overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius)}}>
                <Navigator url={'/goods/pages/detail?id='+item.id}>
                    <View className={'relative'} style={{width: '100%', paddingTop: '100%'}}>
                        <FallbackImage mode={'aspectFill'} style={{borderRadius: Taro.pxTransform(radius)}} className={'absolute z-0 inset-0 block w-full h-full'} src={utils.resolveUrl(item.images.split(',')[0])}/>
                    </View>
                    <View className={'px-2 mt-2'}>{item.title}</View>
                    <View className={'px-2 mb-2 text-sm'}>
                        起拍价 <Text className={'text-red-500'}>RMB</Text> <Text className={'text-red-500 text-lg'}>{numeral(item.startPrice).format('0,0.00')}</Text>
                    </View>
                </Navigator>
            </View>
        );
    }
    renderPerformance(data) {
        let radius = 0;
        if(data.type == 1) {
            return (
                <View className={'bg-white relative overflow-hidden shadow-outer'} style={{borderRadius: Taro.pxTransform(radius)}}>
                    <Navigator url={'/performance/pages/detail?id=' + data.id}>
                        <View className={'relative'} style={{width: '100%'}}>
                            <FallbackImage mode={'widthFix'}
                                           className={'block w-full'} src={utils.resolveUrl(data.preview)}/>
                            <View className={listStyle.wrap}><Text className={classNames(listStyle.silkRibbon6, 'text-white text-sm bg-red-400')}>限时拍</Text></View>
                        </View>
                        <View className={'p-4 space-y-2 divide-y divide-gray-100'}>
                            <View className={'space-y-1'}>
                                <View className={'font-bold text-lg'}>
                                    {data.title}
                                </View>
                                <TimeCountDowner
                                    className={'flex text-sm'}
                                    endTime={data.endTime}
                                    startTime={data.startTime}
                                />
                            </View>
                            <View className={'flex space-x-4 pt-2'}>
                                <Text>报名{data.depositCount}人</Text>
                                <Text>围观{data.viewCount}人</Text>
                                <Text>出价{data.offerCount}次</Text>
                            </View>
                        </View>
                    </Navigator>
                </View>
            );
        }
        else {
            return (
                <View className={'bg-white relative overflow-hidden shadow-outer'} style={{borderRadius: Taro.pxTransform(radius)}}>
                    <Navigator url={'/performance/pages/detail2?id=' + data.id}>
                        <View className={'relative'} style={{width: '100%'}}>
                            <FallbackImage mode={'widthFix'}
                                           className={'block w-full'} src={utils.resolveUrl(data.preview)}/>
                            <View className={listStyle.wrap}><Text className={classNames(listStyle.silkRibbon6, 'text-white text-sm bg-indigo-600')}>同步拍</Text></View>
                        </View>
                        <View className={'p-4 space-y-2 divide-y divide-gray-100'}>
                            <View className={'space-y-1'}>
                                <View className={'font-bold text-lg'}>
                                    {data.title}
                                </View>
                                {data.state == 0 && data.startTime != null &&
                                    <TimeCountDowner
                                        mode={TimeCountDownerMode.Manual}
                                        className={'flex text-sm'}
                                        startTime={data.startTime}
                                        started={data.state == 1}
                                        ended={data.state == 2}
                                    />
                                }
                            </View>
                            <View className={'flex pt-2 space-x-4'}>
                                <Text>报名{data.depositCount}人</Text>
                                <Text>围观{data.viewCount}人</Text>
                                <Text>出价{data.offerCount}次</Text>
                            </View>
                        </View>
                    </Navigator>
                </View>
            );
        }
    }
    handleInputSearch(e) {
        console.log(e.detail.value);
        let key = e.detail.value;
        if(key) {
            this.searchHandler(key);
        }
    }
    render() {
        return (
            <PageLayout statusBarProps={{title: '搜索专场或拍品'}}>
                <View className={'px-4 bg-white pb-2'}>
                    <View className={'py-2 px-4 rounded-full border border-solid border-gray-400 flex items-center text-gray-400'}>
                        <View className={'mr-4'}><Text className={'fa fa-search'} /></View>
                        <Input onInput={this.handleInputSearch} placeholder={'输入关键字，搜索专场或拍品'} className={'text-lg block flex-1'} />
                    </View>
                </View>
                <LineTitle text={'搜索到的拍品列表'} style={{marginTop: 20, marginBottom: 20}} />
                {this.state.goodsList.length == 0 && <NoData />}
                <View className={'grid grid-cols-2 gap-4 px-4'}>
                    {this.state.goodsList.map(item=>this.renderGoods(item))}
                </View>
                <LineTitle text={'搜索到的专场列表'} style={{marginTop: 20, marginBottom: 20}} />
                {this.state.performanceList.length == 0 && <NoData />}
                <View className={'grid grid-cols-1 gap-4 px-4'}>
                    {this.state.performanceList.map(item=>this.renderPerformance(item))}
                </View>
            </PageLayout>
        );
    }
}
