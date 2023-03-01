import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import utils from "../../lib/utils";
import CustomSwiper, {CustomSwiperItem} from "../../components/swiper";
import {Text, View} from "@tarojs/components";
import Clocker from 'clocker-js/Clocker';
import Taro from "@tarojs/taro";

const numeral = require('numeral');


export default class Index extends Component<any, any> {
    state: any = {
        id: 0,
        goods: null,
        counting: false,
    }

    clocker: any;
    timer: any;

    onLoad(options) {
        utils.showLoading();
        this.setState({id: options.id});
        request.get("/paimai/api/goods/detail", {params: {id: options.id}}).then(res => {
            this.setState({goods: res.data.result});
            let endDate = new Date(res.data.result.endTime);
            this.clocker = new Clocker(endDate);
            this.clocker.countDown = true;
            utils.hideLoading();
            if (this.clocker.isCounting) {
                this.timer = setInterval(() => {
                    if (this.clocker.isCounting) {
                        this.setState({counting: this.clocker.isCounting});
                    } else {
                        clearInterval(this.timer);
                    }
                }, 1000);
            }
        });
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        const {goods} = this.state;
        if (goods == null) return <></>;

        const images: CustomSwiperItem[] = goods.images.split(',').map((item, index) => {
            return {id: index, url: '#', image: item};
        });


        return (
            <PageLayout statusBarProps={{title: '拍品详情'}}>
                <CustomSwiper list={images} imageMode={'heightFix'} radius={'0'}/>
                <View className={'p-4 space-y-4 divide-y'}>
                    <View className={'space-y-2'}>
                        <View className={'flex justify-between items-center'}>
                            <View>
                                <View className={'font-bold text-xl'}>
                                    {goods.title}
                                </View>
                                <View className={'text-gray-600 mt-2'}>
                                    起拍价 <Text className={'text-sm text-red-500 font-bold'}>RMB</Text> <Text
                                    className={'text-lg text-red-500 font-bold'}>{numeral(goods.startPrice).format('0,0.00')}</Text>
                                </View>
                            </View>
                            <View className={'flex flex-col items-center text-gray-600'}>
                                <View><Text className={'iconfont icon-daojishi text-3xl'}/></View>
                                <View className={'text-sm'}>结束提醒</View>
                            </View>
                        </View>
                        {this.clocker.isCounting &&
                            <View className={'flex items-center text-sm space-x-1'}>
                                <View className={'border rounded-r-full px-1 border-red-500 border-solid text-red-500'}>竞拍中</View>
                                <View>距结束: <Text className={'text-red-600'}>{numeral(this.clocker.date).format('00')}</Text>天<Text
                                    className={'text-red-600'}>{numeral(this.clocker.hours).format('00')}</Text>小时<Text
                                    className={'text-red-600'}>{numeral(this.clocker.minutes).format('00')}</Text>分<Text
                                    className={'text-red-600'}>{numeral(this.clocker.seconds).format('00')}</Text>秒</View>
                            </View>
                        }
                        {!this.clocker.isCounting &&
                            <View className={'flex items-center text-sm space-x-1'}>
                                <View className={'border rounded-r-full px-1 border-gray-500 border-solid text-gray-500'}>已结束</View>
                                <View>结束时间: {goods.actualEndTime}</View>
                            </View>
                        }
                        <View className={'text-sm text-gray-400 space-x-4'}>
                            <Text>围观{goods.viewCount}人</Text>
                            <Text>出价{goods.offerCount}次</Text>
                        </View>
                    </View>
                    <View>
                        <View className={'py-4 flex justify-between'}>
                            <View className={'font-bold'}>出价记录({goods.offerCount})</View>
                            <View>查看全部<Text className={'iconfont icon-youjiantou_huaban'}/></View>
                        </View>
                    </View>
                </View>
                <View className={'bg-white px-4 divide-y'}>
                    <View className={'py-4 flex'}>
                        <View className={'text-gray-400'} style={{width: Taro.pxTransform(90)}}>拍卖专场</View>
                        <View className={'flex-1 flex items-center justify-between'}>
                            <View>111</View>
                            <Text className={'iconfont icon-youjiantou_huaban text-gray-400'}/>
                        </View>
                    </View>
                </View>
            </PageLayout>
        );
    }
}
