import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import utils from "../../lib/utils";
import CustomSwiper, {CustomSwiperItem} from "../../components/swiper";
import {Button, RichText, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {connect} from "react-redux";
import classNames from "classnames";
import PageLoading from "../../components/pageloading";

const numeral = require('numeral');

// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
    }
))
export default class Index extends Component<any, any> {
    state: any = {
        id: 0,
        goods: null,
        posting: false,
    }

    constructor(props) {
        super(props);
        this.onShareAppMessage = this.onShareAppMessage.bind(this);
        this.onShareTimeline = this.onShareTimeline.bind(this);
        this.toggleFollow = this.toggleFollow.bind(this);
        this.buy = this.buy.bind(this);
        this.addInCart = this.addInCart.bind(this);
    }


    componentDidMount() {

    }

    // @ts-ignore
    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if (prevProps.context.userInfo == null || prevState.goods == null) {
            const {context} = this.props;
            const {userInfo} = context;
            let {goods} = this.state;
            if (userInfo != null && goods) {
                //记录浏览记录
                request.post('/paimai/api/members/views', null, {params: {id: this.state.id}}).then(res => {
                    console.log(res.data.result);
                });
            }
        }
    }


    onLoad(options) {
        utils.showLoading();
        this.setState({id: options.id});
        request.get("/paimai/api/goods/detail", {params: {id: options.id}}).then(res => {
            let data = res.data.result;
            utils.hideLoading();
            this.setState({goods: data});
        });
    }

    onShareTimeline() {
        let mid = this.props.context?.userInfo?.id || '';
        return {
            title: this.state.goods?.title,
            query: {mid: mid},
        }
    }

    onShareAppMessage() {
        let mid = this.props.context?.userInfo?.id || '';
        return {
            title: this.state.goods?.title,
            path: '/pages/goods/detail2?id=' + this.state.id +'&mid='+mid
        }
    }

    toggleFollow() {
        request.put('/paimai/api/members/follow/toggle', {id: this.state.id}).then(res => {
            let goods = this.state.goods;
            goods.followed = res.data.result;
            this.setState({goods: goods});
        });
    }

    buy() {
        //当前商品数据保存到本地缓存
        Taro.navigateTo({url: '/pages/shop/confirm?id=' + this.state.goods.id}).then();
    }

    addInCart() {
        let cartGoods = JSON.parse(Taro.getStorageSync('CART') || '[]');
        let goods = this.state.goods;
        goods.selected = true;
        goods.count = 1;
        let existsIndex = -1;
        cartGoods.forEach((item, index) => {
            if (goods.id == item.id) {
                existsIndex = index;
            }
        });
        if (existsIndex > -1) {
            cartGoods[existsIndex].count++;
        } else {
            cartGoods.push(goods);
        }

        Taro.setStorageSync('CART', JSON.stringify(cartGoods));
        utils.showSuccess(false, '加入成功');
    }


    renderButton() {
        return (
            <>
                <View className={'flex items-center space-x-2'}>
                    <Button className={'btn btn-warning'} onClick={this.addInCart}>
                        <View>加入购物车</View>
                    </Button>
                </View>
                <View className={'flex items-center space-x-2'}>
                    <Button disabled={this.state.posting} className={'btn btn-primary'} onClick={this.buy}>
                        <View>立即购买</View>
                    </Button>
                </View>
            </>
        );
    }

    componentWillUnmount() {

    }

    render() {
        const {goods} = this.state;
        const {systemInfo} = this.props;
        if (goods == null) return <PageLoading/>;

        const images: CustomSwiperItem[] = goods.images.split(',').map((item, index) => {
            return {id: index, url: '#', image: item};
        });
        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;

        return (
            <PageLayout statusBarProps={{title: '商品详情'}}>
                <CustomSwiper list={images} imageMode={'heightFix'} radius={'0'}/>
                <View className={'grid bg-white grid-cols-1 px-4 divide-y divide-gray-200'}>
                    <View className={'p-4 space-y-2'}>
                        <View className={'font-bold text-xl'}>
                            {goods.title}
                        </View>
                        <View className={'text-gray-400'}>
                            {goods.subTitle}
                        </View>
                        <View className={'flex justify-between text-gray-600 mt-2'}>
                            <View>
                                一口价 <Text className={'text-sm text-red-500 font-bold'}>RMB</Text>
                                <Text className={'text-lg text-red-500 font-bold'}>{numeral(goods.startPrice).format('0,0.00')}</Text>
                            </View>
                            <View className={'space-x-2 text-gray-400'}>
                                <Text>
                                    已售：{goods.sales + goods.baseSales}
                                </Text>
                                <Text>
                                    库存：{goods.stock}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className={'bg-white p-4 mt-4'}>
                    <View className={'font-bold text-center text-lg'}>商品详情</View>
                    <View>
                        <RichText nodes={utils.resolveHtmlImageWidth(goods.description)} space={'nbsp'}/>
                    </View>
                </View>
                <View style={{height: Taro.pxTransform(124)}}/>
                <View className={'absolute bg-white rounded-full overflow-hidden p-1 shadow-outer'} style={{bottom: 124, right: 16}}>
                    <Button openType={'share'} plain={true} className={'block flex flex-col items-center justify-center'} style={{width: 40, height: 40}}>
                        <View className={'text-xl'}>
                            <View className={'iconfont icon-fenxiang text-xl'}/>
                        </View>
                    </Button>
                </View>
                <View className={'bg-white px-4 pt-1 flex items-center justify-between fixed bottom-0 w-full'}
                      style={{paddingBottom: safeBottom}}>
                    <View>
                        <Button openType={'contact'} plain={true} className={'block flex flex-col items-center'}>
                            <View className={'iconfont icon-lianxikefu text-xl'}/>
                            <View>客服</View>
                        </Button>
                    </View>
                    <View onClick={this.toggleFollow}
                          className={classNames('flex flex-col items-center space-y-1', goods.followed ? 'text-red-500' : '')}>
                        <View className={classNames('iconfont icon-31guanzhu1 text-xl')}/>
                        <View>收藏</View>
                    </View>
                    {this.renderButton()}
                </View>
            </PageLayout>
        );
    }
}
