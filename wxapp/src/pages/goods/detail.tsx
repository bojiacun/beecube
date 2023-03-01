import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import utils from "../../lib/utils";
import CustomSwiper, {CustomSwiperItem} from "../../components/swiper";
import {Text, View} from "@tarojs/components";
import Clocker from 'clocker-js/Clocker';
const numeral = require('numeral');



export default class Index extends Component<any, any> {
    state:any = {
        id: 0,
        goods: null
    }

    clocker: any;

    onLoad(options) {
        utils.showLoading();
        this.setState({id: options.id});
        request.get("/paimai/api/goods/detail", {params: {id: options.id}}).then(res=>{
            this.setState({goods: res.data.result});
            let endDate = new Date(res.data.result.endTime);
            this.clocker = new Clocker(endDate);
            this.clocker.countDown = true;
            utils.hideLoading();
        });
    }
    render() {
        const {goods} = this.state;
        if(goods == null) return <></>;

        const images:CustomSwiperItem[] = goods.images.split(',').map((item,index) => {
            return {id: index, url: '#', image: item};
        });

        return (
            <PageLayout statusBarProps={{title: '拍品详情'}}>
                <CustomSwiper list={images} imageMode={'heightFix'} />
                <View className={'flex justify-between items-center'}>
                    <View>
                        <View className={'text-bold text-lg'}>
                            {goods.name}
                        </View>
                        <View className={'text-gray-300'}>
                            起拍价 <Text className={'text-sm text-red-400'}>RMB</Text> <Text className={'text-lg text-red-400'}>{numeral(goods.startPrice).format('0,0.00')}</Text>
                        </View>
                    </View>
                    <View>
                        <View><Text className={'iconfont icon-daojishi text-xl'} /></View>
                        <View>结束提醒</View>
                    </View>
                </View>
            </PageLayout>
        );
    }
}
