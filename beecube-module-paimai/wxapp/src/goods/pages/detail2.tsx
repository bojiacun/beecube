import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {API_URL, APP_ID} from "../../lib/request";
import utils from "../../lib/utils";
import CustomSwiper, {CustomSwiperItem} from "../../components/swiper";
import {Button, RichText, Text, View} from "@tarojs/components";
import {Button as TaroifyButton} from '@taroify/core';
import Taro from "@tarojs/taro";
import {connect} from "react-redux";
import classNames from "classnames";
import PageLoading from "../../components/pageloading";
import FallbackImage from "../../components/FallbackImage";
import {Tag} from "@taroify/core";

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
        shareAdv: null,
        loadingShareAdv: false,
        hideModal: true,
        openSpec: false,
        specs: [],
        specId: null,
    }

    constructor(props) {
        super(props);
        this.onShareAppMessage = this.onShareAppMessage.bind(this);
        this.onShareTimeline = this.onShareTimeline.bind(this);
        this.toggleFollow = this.toggleFollow.bind(this);
        this.buy = this.buy.bind(this);
        this.addInCart = this.addInCart.bind(this);
        this.openShareGoods = this.openShareGoods.bind(this);
        this.handleSaveToPhotoAlbum = this.handleSaveToPhotoAlbum.bind(this);
        this.openWxServiceChat = this.openWxServiceChat.bind(this);
    }

    openShareGoods() {
        this.setState({hideModal: false, loadingShareAdv: true});
        request.get('/paimai/api/members/share/goods', {params: {id: this.state.goods.id}, responseType: 'arraybuffer'}).then((res: any) => {
            let data = Taro.arrayBufferToBase64(res.data);
            this.setState({shareAdv: data});
        });
    }

    handleSaveToPhotoAlbum() {
        const token = Taro.getStorageSync("TOKEN");
        Taro.downloadFile({
            url: API_URL + '/paimai/api/members/share/goods?id=' + this.state.goods.id,
            header: {'X-Access-Token': token, 'Authorization': token, 'X-App-Id': APP_ID},
        }).then(res => {
            Taro.saveImageToPhotosAlbum({filePath: res.tempFilePath}).then(() => {
                utils.showSuccess(false, '保存成功');
                this.clickMask();
            });
        })
    }

    componentDidMount() {

    }

    clickMask() {
        this.setState({hideModal: true, loadingShareAdv: false});
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
            request.get('/paimai/api/goods/specs', {params: {id: options.id}}).then(res => {
                this.setState({specs: res.data.result})
            });
        });
    }
    postIntegral() {
        request.post('/paimai/api/members/score/share').then(()=>{});
    }
    onShareTimeline() {
        let mid = this.props.context?.userInfo?.id || '';
        this.postIntegral();
        return {
            title: this.state.goods?.title,
            query: {mid: mid},
        }
    }

    onShareAppMessage() {
        let mid = this.props.context?.userInfo?.id || '';
        this.postIntegral();
        return {
            title: this.state.goods?.title,
            path: '/goods/pages/detail2?id=' + this.state.id + '&mid=' + mid
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
                    <TaroifyButton color={'warning'} block shape={'round'} onClick={this.addInCart}>
                        <View>加入购物车</View>
                    </TaroifyButton>
                </View>
                <View className={'flex items-center space-x-2'}>
                    <TaroifyButton block shape={'round'} color={'danger'} disabled={this.state.posting} onClick={this.buy}>
                        <View>立即购买</View>
                    </TaroifyButton>
                </View>
            </>
        );
    }

    componentWillUnmount() {

    }

    changeSpec(item) {
        this.setState({goods: item});
    }

    getCurrentSpec() {
        return this.state.specs.filter((s: any) => s.id == this.state.goods.id)[0];
    }

    openWxServiceChat() {
        const {wxServiceChatCorpId, wxServiceChatUrl} = this.props.settings;
        Taro.openCustomerServiceChat({
            extInfo: {url: wxServiceChatUrl},
            corpId: wxServiceChatCorpId,
        });
    }

    render() {
        const {goods, hideModal, specs} = this.state;
        const {systemInfo, settings} = this.props;
        if (goods == null) return <PageLoading/>;
        let currentSpec = this.getCurrentSpec();
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
                            <View>{goods.title}</View>
                        </View>
                        <View className={'text-gray-400'}>
                            {goods.subTitle}
                        </View>
                        <View className={'space-x-2'}>
                            {specs.map((item: any) => {
                                return (
                                    <Tag size={'medium'} onClick={() => this.changeSpec(item)} color={currentSpec?.id == item.id ? 'danger' : 'default'}
                                         variant={currentSpec?.id == item.id ? 'contained' : 'outlined'}
                                         shape={'rounded'}>{item.spec}</Tag>
                                );
                            })}
                        </View>
                        <View className={'flex justify-between text-gray-600 mt-2'}>
                            <View>
                                <Text className={'text-sm text-red-500 font-bold'}>￥</Text>
                                <Text className={'text-xl text-red-500 font-bold'}>{numeral(goods.startPrice).format('0,0.00')}</Text>
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
                    <Button onClick={this.openShareGoods} plain={true} className={'block flex flex-col items-center justify-center'} style={{width: 40, height: 40}}>
                        <View className={'text-xl'}>
                            <View className={'iconfont icon-fenxiang text-xl'}/>
                        </View>
                    </Button>
                </View>
                <View className={'bg-white px-4 pt-1 flex items-center justify-between fixed bottom-0 w-full'}
                      style={{paddingBottom: safeBottom}}>
                    {!settings.wxServiceChatCorpId &&
                        <View>
                            <Button openType={'contact'} plain={true} className={'block flex flex-col items-center'}>
                                <View className={'iconfont icon-lianxikefu text-xl'}/>
                                <View>客服</View>
                            </Button>
                        </View>
                    }
                    {settings.wxServiceChatCorpId &&
                        <View>
                            <Button onClick={this.openWxServiceChat} plain={true} className={'block flex flex-col items-center'}>
                                <View className={'iconfont icon-lianxikefu text-xl'}/>
                                <View>客服</View>
                            </Button>
                        </View>
                    }
                    <View onClick={this.toggleFollow}
                          className={classNames('flex flex-col items-center space-y-1', goods.followed ? 'text-red-500' : '')}>
                        <View className={classNames('iconfont icon-31guanzhu1 text-xl')}/>
                        <View>收藏</View>
                    </View>
                    {this.renderButton()}
                </View>
                <View className={'modals-mask'} style={{display: hideModal ? 'none' : 'block'}} onClick={this.clickMask} />
                {this.state.loadingShareAdv && <View className={'w-full h-full flex flex-col z-100 items-center justify-center absolute top-0 right-0'}>
                    <View className={'flex flex-col items-center relative'} style={{height: '70%'}}>
                        {this.state.shareAdv &&
                            <View className={'absolute z-10 text-white text-4xl'} style={{right: 5, top: -20}} onClick={() => this.setState({hideModal: true, loadingShareAdv: false, shareAdv: false})}>
                                <Text className={'fa fa-close'}/>
                            </View>
                        }
                        {this.state.shareAdv && <FallbackImage className={'flex-1 block'} src={'data:image/png;base64,' + this.state.shareAdv} mode={'aspectFit'}/>}
                        {!this.state.shareAdv && <PageLoading style={{height: 500}}/>}
                        <View className={'space-x-4 mt-4 flex-none'}>
                            <Button openType={'share'} className={'btn btn-info'}>发给好友</Button>
                            <Button onClick={this.handleSaveToPhotoAlbum} className={'btn btn-warning'}>保存到相册</Button>
                        </View>
                    </View>
                </View>}
            </PageLayout>
        );
    }
}
