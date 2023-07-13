import {Component} from "react";
import PageLoading from "../../components/pageloading";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";
import {Text, View} from "@tarojs/components";
import {Button, List, Loading, Checkbox} from "@taroify/core";
import numeral from 'numeral';
import Taro from "@tarojs/taro";
import {connect} from "react-redux";
import utils from "../../lib/utils";
import styles from './index.module.scss';

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
        list: null,
        loading: false,
        hasMore: true,
        scrollTop: 0,
        reachTop: true,
        page: 1,
        pageSize: 20,
        selected: [],
    }

    constructor(props) {
        super(props);
        this.onLoad = this.onLoad.bind(this);
        this.onPageScroll = this.onPageScroll.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.toggleCheckAll = this.toggleCheckAll.bind(this);
        this.handleToCreate = this.handleToCreate.bind(this);
    }

    onPageScroll({scrollTop}) {
        this.setState({scrollTop, reachTop: scrollTop === 0});
    }


    onLoad() {
        this.setState({loading: true});
        const newList = this.state.list || [];
        request.get('/paimai/api/members/fapiao/orders', {params: {status: 3, pageNo: this.state.page, pageSize: this.state.pageSize}}).then(res => {
            let records = res.data.result.records;
            records.forEach(item => newList.push(item));
            this.setState({list: newList, loading: false, hasMore: records.length >= this.state.pageSize, page: this.state.page + 1});
        });
    }


    toggleCheckAll() {
        if (this.isCheckedAll) {
            this.setState({selected: []});
        } else {
            this.setState({selected: this.state.list.map(item => item.id)});
        }
    }

    get isCheckedAll() {
        let selected = this.state.selected;
        if (selected.length == 0) return false;
        return selected.length == this.state.list.length;
    }

    get calcCartPrice() {
        let totalPrice = 0;
        this.state.list.forEach(item => {
            if (utils.indexOf(this.state.selected, item.id)) {
                totalPrice += item.payedPrice;
            }
        })
        return totalPrice;
    }

    handleSelect(values) {
        this.setState({selected: values});
    }

    handleToCreate() {
        Taro.setStorageSync("TAX_ORDERS", this.state.selected);
        Taro.navigateTo({url: 'taxs/create'});
    }

    render() {
        const {list, scrollTop, hasMore, loading, selected} = this.state;
        const {systemInfo} = this.props;
        if (!list) return <PageLoading/>;

        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;

        return (
            <PageLayout statusBarProps={{title: '发票中心'}} enableReachBottom>
                <Checkbox.Group className={'p-4'} onChange={this.handleSelect} value={this.state.selected}>
                    <View className={'flex justify-end'}><Button className={'btn btn-outline'} size={'small'}
                                                                 onClick={() => Taro.navigateTo({url: 'taxs/history'})}>开票记录</Button></View>
                    <View className={'item-title text-lg mb-4'}>待开票订单</View>
                    <List className={''} loading={loading} hasMore={hasMore} scrollTop={scrollTop} onLoad={this.onLoad}>
                        {
                            list.map((item) => {
                                return (
                                    <View className={'flex items-center space-x-4 bg-none pb-2 mb-2 border-b border-gray-300'} key={item.id}>
                                        <View className={'flex-none'}><Checkbox className={styles.redCheckbox} name={item.id}/></View>
                                        <View className={'flex-1'}>
                                            <View className={'text-sm text-stone-400'}>订单编号 | {item.id}</View>
                                            <View className={'flex flex-col mt-2'}>
                                                {
                                                    item.orderGoods.map(item => {
                                                        return (
                                                            <View className={'space-y-1 mb-2'}>
                                                                <View>{item.goodsName}</View>
                                                                <View>￥{item.goodsPrice} X {item.goodsCount}</View>
                                                            </View>
                                                        );
                                                    })
                                                }
                                            </View>
                                        </View>
                                        <View className={'text-xl font-bold text-red-600 flex-none'}>
                                            ￥{numeral(item.payedPrice).format('0,0.00')}
                                        </View>
                                    </View>
                                );
                            })
                        }
                        <List.Placeholder>
                            {loading && <Loading>加载中...</Loading>}
                            {!hasMore && "没有更多了"}
                            <View style={{height: safeBottom + 56}}/>
                        </List.Placeholder>
                    </List>
                </Checkbox.Group>

                <View className={'bg-white flex items-center fixed py-2 px-4 w-full bottom-0 left-0'} style={{paddingBottom: safeBottom}}>
                    <View className={'flex-1 flex items-center space-x-4'}>
                        <View className={'flex flex-col items-center'}>
                            <Checkbox id={'all'} className={styles.redCheckbox} checked={this.isCheckedAll} onClick={this.toggleCheckAll}/>
                            <View className={'text-sm'}>全选</View>
                        </View>
                        <View className={'flex-1'}>
                            共<Text className={'font-bold text-red-600'}>{selected.length}</Text>个订单 <Text
                            className={'text-red-600 font-bold'}>{numeral(this.calcCartPrice).format('0,0.00')}</Text>元
                        </View>
                    </View>
                    <View className={'flex-none'}>
                        <Button disabled={this.calcCartPrice <= 0} shape={'round'} className={'btn btn-danger'}
                                onClick={this.handleToCreate}>去开票</Button>
                    </View>
                </View>
            </PageLayout>
        );
    }
}
