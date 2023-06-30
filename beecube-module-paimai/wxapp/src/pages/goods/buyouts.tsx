import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import ListView, {ListViewTabItem} from "../../components/listview";
import request from "../../lib/request";
import FlowListView from "../../components/flowlistview";
import classNames from "classnames";
import styles from "../../flow.module.scss";
import {Text, View} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
import {connect} from "react-redux";
import {Button, Popup, Stepper, Tag} from "@taroify/core";
import utils from "../../lib/utils";
import Taro from "@tarojs/taro";
import CustomSwiper from "../../components/swiper";

const numeral = require('numeral');

// @ts-ignore
@connect((state: any) => (
    {
        settings: state.context.settings,
    }
))
export default class Index extends Component<any, any> {
    state = {
        tabs: [],
        openSpec: false,
        specs: [],
        specId: null,
        swipers: [],
        tabClassName: 'bg-none',
    }

    constructor(props) {
        super(props);
        this.renderTemplate = this.renderTemplate.bind(this);
        this.loadData = this.loadData.bind(this);
        this.joinCart = this.joinCart.bind(this);
        this.changeSpec = this.changeSpec.bind(this);
        this.handleChangeCount = this.handleChangeCount.bind(this);
        this.doJoinCart = this.doJoinCart.bind(this);
    }

    loadData(pageIndex: number, tab: ListViewTabItem) {
        let params: any = {column: 'create_time', orderBy: 'desc', pageNo: pageIndex};
        if (tab.id) {
            params.classId = tab.id;
        }
        return request.get('/paimai/api/goods/mall/list', {params: params});
    }

    joinCart(e, id) {
        e.stopPropagation();
        e.preventDefault();
        request.get('/paimai/api/goods/specs', {params: {id: id}}).then(res => {
            this.setState({openSpec: true, specs: res.data.result, specId: id});
        });
    }
    doJoinCart() {
        const currentSettle:any = this.getCurrentSpec();
        currentSettle.count = currentSettle.count || 1;
        let cartGoods = JSON.parse(Taro.getStorageSync('CART') || '[]');
        let goods = currentSettle;
        goods.selected = true;
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
        this.setState({openSpec:false});
    }


    handleChangeCount(value:string) {
        const specs:any = this.getCurrentSpec();
        specs.count = value;
        this.setState({specs: [...this.state.specs]});
    }
    changeSpec(id) {
        this.setState({specId: id});
    }

    getCurrentSpec() {
        return this.state.specs.filter((s: any) => s.id == this.state.specId)[0];
    }

    gotoDetail(e, url) {
        e.stopPropagation();
        e.preventDefault();
        Taro.navigateTo({url: url}).then();
    }

    renderTemplate(data: any) {
        const imgUrl = data.listCover ? data.listCover : data.images.split(',')[0];
        const tags = data.tags?.split(',') || [];
        return (
            <View className={classNames('bg-white rounded-lg overflow-hidden shadow-lg', styles.flow)}>
                <View onClick={event => this.gotoDetail(event, '/goods/pages/detail2?id=' + data.id)}>
                    <FallbackImage mode={'widthFix'} className={'rounded block w-full mb-2'} src={imgUrl}/>
                    {tags.length > 0 && <View className={'px-2 mb-2 space-x-2 flex'}>{tags.map((item: any) => {
                        return (
                            <View className={'border rounded px-1 border-red-500 border-solid text-red-500'}>{item}</View>
                        );
                    })}</View>}
                    <View className={'px-2 text-lg'}>{data.title}</View>
                    <View className={'px-2 text-stone-400'}>{utils.delHtml(data.subTitle)}</View>
                    <View className={'px-2 mb-2 flex justify-between items-center'}>
                        <View>
                            <Text className={'text-red-500'}>￥</Text> <Text className={'text-red-500 text-xl'}>{numeral(data.startPrice).format('0,0.00')}</Text>
                        </View>
                        <View onClick={event => this.joinCart(event, data.id)} className={'rounded-full bg-red-500 flex items-center text-lg justify-center text-white'}
                              style={{width: 24, height: 24}}>
                            <Text className={'iconfont icon-gouwuche'}/>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    componentDidMount() {
        request.get('/paimai/api/goods/buyout/classes').then(res => {
            let classes = res.data.result;
            let tabs = classes.map((cls) => {
                return {label: cls.name, id: cls.id, template: this.renderTemplate}
            });
            tabs.unshift({label: '推荐', id: "-1", template: this.renderTemplate});
            // tabs.unshift({label: '全部', id: undefined, template: this.renderTemplate});
            this.setState({tabs: tabs});
        });
        request.get('/paimai/api/goods/swiper/list').then(res=>{
            this.setState({swipers: res.data.result});
        });
    }

    onPullDownRefresh() {

    }
    onPageScroll(e) {
        if(e.scrollTop >= 230) {
            this.setState({tabClassName: 'bg-white'});
        }
        else {
            this.setState({tabClassName: 'bg-none'});
        }
    }

    render() {
        const {settings} = this.props;
        const {openSpec, specs,swipers,tabClassName} = this.state;
        let currentSpec;
        if (openSpec) {
            currentSpec = this.getCurrentSpec();
        }

        return (
            <PageLayout statusBarProps={{title: settings.buyoutListTitle || '一口价', button: <Text className={'fa fa-search'} onClick={()=>Taro.navigateTo({url: '/pages/goods/search'})} />}} enableReachBottom={true} showTabBar={true}>
                <View className={'flex items-center text-red-700 justify-center'} style={{height: 50}}>
                    <View className={'flex-1 text-center'}>正品保证</View>
                    <View className={'flex-1 text-center'}>全场包邮</View>
                    <View className={'flex-1 text-center'}>售后无忧</View>
                </View>
                {swipers.length > 0 && <CustomSwiper className={'rounded-lg mx-4 mb-4 overflow-hidden'} list={swipers} height={160} indicatorActiveColor={'#b91c1c'} dotStyle={0} />}
                {utils.compareVersion(Taro.getAppBaseInfo().SDKVersion, '2.29.1') > 0 ?
                    <FlowListView tabs={this.state.tabs} dataFetcher={this.loadData} tabClassName={swipers.length > 0 ? tabClassName: 'bg-white'} />
                    :
                    <ListView tabs={this.state.tabs} dataFetcher={this.loadData} className={'grid grid-cols-2 gap-4 p-4'} tabClassName={swipers.length > 0 ? tabClassName: 'bg-white'} />
                }
                <Popup style={{height: 330}} open={openSpec} rounded placement={'bottom'} onClose={() => this.setState({openSpec: false})}>
                    <View className={'text-2xl'}>
                        <Popup.Close />
                    </View>
                    <View className={'p-4 space-y-4 mt-6 flex flex-col justify-between'} style={{paddingBottom: 84}}>
                        <View className={'space-y-4'}>
                            {currentSpec && <View className={'flex items-center'}>
                                <View className={'flex-none'}>
                                    <FallbackImage style={{width: 60, height: 60}} src={currentSpec.listCover ? currentSpec.listCover : currentSpec.images.split(',')[0]}/>
                                </View>
                                <View className={'flex-1 ml-2'}>
                                    <View className={'text-lg font-bold'}>{currentSpec.title}</View>
                                    <View className={'text-red-600 font-bold text-xl'}>￥{currentSpec.startPrice}</View>
                                </View>
                            </View>}
                            <View className={'space-x-2'}>
                                {specs.map((item: any) => {
                                    return (
                                        <Tag size={'large'} onClick={() => this.changeSpec(item.id)} color={currentSpec?.id == item.id ? 'danger' : 'default'} variant={'outlined'}
                                             shape={'rounded'}>{item.spec}</Tag>
                                    );
                                })}
                            </View>
                        </View>
                        <View className={'flex items-center justify-between'}>
                            <View>数量</View>
                            <View>
                                <Stepper shape={'circular'} value={currentSpec?.count??1} size={22} onChange={this.handleChangeCount} />
                            </View>
                        </View>
                        <View><Button color={'danger'} block onClick={()=>this.doJoinCart()}>加入购物车</Button></View>
                    </View>
                </Popup>
            </PageLayout>
        );
    }
}
