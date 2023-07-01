import {Component, FC, useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Button, List, Loading, Tabs} from "@taroify/core";
import {connect} from "react-redux";
import utils from "../../lib/utils";
import Taro from "@tarojs/taro";
import request from "../../lib/request";
import {Text, View} from "@tarojs/components";
import classNames from "classnames";


const CouponList:FC<any> = (props) => {
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState<number>(1);
    const [list, setList] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [scrollTop, setScrollTop] = useState(0)

    Taro.usePageScroll(({ scrollTop: aScrollTop }) => setScrollTop(aScrollTop));

    return (
        <List
            loading={loading}
            hasMore={hasMore}
            scrollTop={scrollTop}
            onLoad={() => {
                setLoading(true);
                request.get('/paimai/api/members/coupons', {params: {type: props.type, pageSize: 20, pageNo: page}}).then(res=>{
                    let records = res.data.result.records;
                    records.forEach(item => list.push(item));
                    setList([...list]);
                    setHasMore(records.length >= 20);
                    setLoading(false);
                    setPage(page+1);
                });
            }}
        >
            {
                list.map((item) => (
                    <View className={'m-4'}>
                        <View className={classNames('flex', props.type == 1 ? 'text-white':'text-stone-400')}>
                            <View className={classNames('flex flex-col items-center justify-center rounded-t-lg flex-none', props.type == 1 ? 'bg-red-700': 'bg-stone-200')}
                                  style={{width: 100, height: 80}}>
                                <View className={'font-bold'}>
                                    <Text>￥</Text>
                                    <Text className={'text-4xl'}>
                                        {item.coupon.amount}
                                    </Text>
                                </View>
                                <View className={classNames('text-sm', props.type == 1 ? 'text-stone-200':'text-stone-400')}>满{item.coupon.minPrice}可用</View>
                            </View>
                            <View className={classNames('rounded-t-lg flex-1 flex items-center px-4', props.type == 1 ? 'bg-red-700': 'bg-stone-200')}>
                                <View className={'flex-1'}>
                                    <View className={'font-bold text-lg'}>{item.coupon.title}</View>
                                    <View className={classNames('text-sm mt-2', props.type == 1 ? 'text-stone-200': 'text-stone-400')}>有效期至{item.endTime}</View>
                                </View>
                                {props.type == 1 && <View className={'flex-none'} onClick={()=>Taro.reLaunch({url: '/pages/index/index'})}>
                                    <Button color={'warning'} size={'mini'} shape={'round'} style={{color: '#991b1b', minWidth: 60}}>去使用</Button>
                                </View>}
                            </View>
                        </View>
                        <View className={'bg-white text-cut rounded-b-lg p-4 text-stone-400 text-sm'}>
                            {item.coupon.description}
                        </View>
                    </View>
                ))
            }
            <List.Placeholder>
                {loading && <Loading>加载中...</Loading>}
                {!hasMore && "没有更多了"}
            </List.Placeholder>
        </List>
    )
}

// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
    }
))
export default class Index extends Component<any, any> {
    state:any = {

    }
    render() {
        const {systemInfo} = this.props;
        const headerHeight = utils.calcPageHeaderHeight(systemInfo);
        return (
            <PageLayout statusBarProps={{title: '我的优惠券'}}>
                <Tabs defaultValue={'1'} sticky={{offsetTop: headerHeight}}>
                    <Tabs.TabPane value={'1'} title={'未使用'}>
                        <CouponList type={1} />
                    </Tabs.TabPane>
                    <Tabs.TabPane value={'2'} title={'已使用'}>
                        <CouponList type={2} />
                    </Tabs.TabPane>
                    <Tabs.TabPane value={'3'} title={'已过期'}>
                        <CouponList type={3} />
                    </Tabs.TabPane>
                </Tabs>
            </PageLayout>
        );
    }
}
