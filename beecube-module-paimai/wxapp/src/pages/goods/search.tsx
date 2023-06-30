import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Input, Navigator, Text, View} from "@tarojs/components";
import {debounce} from 'throttle-debounce';
import request from "../../lib/request";
import utils from "../../lib/utils";
import LineTitle from "../../components/LineTitle";
import Taro from "@tarojs/taro";
import FallbackImage from "../../components/FallbackImage";
import NoData from "../../components/nodata";

const numeral = require('numeral');


export default class Index extends Component<any, any> {
    state: any = {
        goodsList: [],
        performanceList: [],
    }
    searchHandler: any;

    constructor(props) {
        super(props);
        this.handleInputSearch = this.handleInputSearch.bind(this);
        this.renderGoods = this.renderGoods.bind(this);
        this.doSearch = this.doSearch.bind(this);
        this.searchHandler = debounce(1000, this.doSearch);
    }

    doSearch(key: string) {
        utils.showLoading();
        request.get('/paimai/api/goods/list', {params: {key: key, type: 2}}).then(res=>{
            utils.hideLoading();
            this.setState({goodsList: res.data.result.records});
        });
    }

    renderGoods(item) {
        let radius = 0;
        return (
            <View className={'bg-white relative overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius)}}>
                <Navigator url={'/goods/pages/detail2?id=' + item.id}>
                    <View className={'relative'} style={{width: '100%', paddingTop: '100%'}}>
                        <FallbackImage mode={'aspectFill'} style={{borderRadius: Taro.pxTransform(radius)}} className={'absolute z-0 inset-0 block w-full h-full'}
                                       src={utils.resolveUrl(item.images.split(',')[0])}/>
                    </View>
                    <View className={'px-2 mt-2'}>{item.title}</View>
                    <View className={'px-2 mb-2 text-sm'}>
                        <Text className={'text-red-500'}>￥</Text> <Text className={'text-red-500 text-lg'}>{numeral(item.startPrice).format('0,0.00')}</Text>
                    </View>
                </Navigator>
            </View>
        );
    }
    handleInputSearch(e) {
        console.log(e.detail.value);
        let key = e.detail.value;
        if (key) {
            this.searchHandler(key);
        }
    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '搜索商品'}}>
                <View className={'px-4 bg-white pb-2'}>
                    <View className={'py-2 px-4 rounded-full border border-solid border-gray-400 flex items-center text-gray-400'}>
                        <View className={'mr-4'}><Text className={'fa fa-search'}/></View>
                        <Input onInput={this.handleInputSearch} placeholder={'输入关键字，搜索商品'} className={'text-lg block flex-1'}/>
                    </View>
                </View>
                <LineTitle text={'搜索到的商品列表'} style={{marginTop: 20, marginBottom: 20}}/>
                {this.state.goodsList.length == 0 && <NoData/>}
                <View className={'grid grid-cols-2 gap-4 px-4'}>
                    {this.state.goodsList.map(item => this.renderGoods(item))}
                </View>
            </PageLayout>
        );
    }
}
