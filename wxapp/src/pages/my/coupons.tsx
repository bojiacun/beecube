import PageLayout from "../../layouts/PageLayout";
import {useState} from "react";
import request, {SERVICE_WINKT_SYSTEM_HEADER} from "../../utils/request";
import Taro, {useReachBottom, useReady} from "@tarojs/taro";
import withLogin from "../../components/login/login";
import {View, Text} from "@tarojs/components";
import classNames from "classnames";
import './coupons.scss'
import moment from "moment";
import NotLogin from "../../components/notlogin";
import ContentLoading from "../../components/contentloading";
import Empty from "../../components/empty/empty";


const MyCoupons = (props: any) => {
    const {checkLogin} = props;
    const [page, setPage] = useState<number>(1);
    const [over, setOver] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState<any[]>([]);
    const isLogin = checkLogin();


    const loadData = (clear = false, page = 1) => {
        if (!isLogin) return;
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/coupons/tickets", SERVICE_WINKT_SYSTEM_HEADER, {page: page}, true).then(res => {
            setLoadingMore(false);
            let list = res.data.data.content;
            if (clear) {
                setOver(false);
                setRecords(list);
            } else {
                if (!list || list.length === 0) {
                    setOver(true);
                } else {
                    setRecords([...records, ...list]);
                }
            }
            setLoading(false);
        }).catch(() => {
            setLoadingMore(false)
            setLoading(false);
        })
    }

    useReady(() => {
        setLoading(true);
        loadData(true);
    });
    useReachBottom(() => {
        if (!over) {
            setLoadingMore(true);
            loadData(false, page + 1);
        }
    });
    return (
        <PageLayout showTabBar={false} pageLoading={loading} showStatusBar={true} statusBarProps={{title: '我的优惠券'}}>
            {!isLogin && <NotLogin onLogin={()=>loadData(true)} />}
            {isLogin && loading && <ContentLoading height='calc(100vh - 100rpx)' />}
            {!loading && isLogin && records.length === 0 && <Empty title="暂无优惠券" />}
            {!loading && isLogin && records.length > 0 &&
                <View className={'container'} style={{paddingTop: Taro.pxTransform(20)}}>
                    {records.map((item: any) => {
                        return (
                            <View
                                className={classNames("stamp stamp01", moment().valueOf() > item.endAt ? 'filter-gray' : '')}>
                                <View className="par">
                                    <View>{item.coupon.name}</View>
                                    <Text className="sign">￥</Text>
                                    <Text className='span'>{item.coupon.amount.toFixed(2)}</Text>
                                    <Text className='sub'>元</Text>
                                    <View>订单满{item.coupon.minConsume.toFixed(2)}元</View>
                                </View>
                                <View className="copy">有效期<View>{moment(item.endAt).format("YYYY-MM-DD")}</View></View>
                                <Text className={'i'}/>
                            </View>
                        );
                    })}
                </View>
            }
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>
        </PageLayout>
    );
}

export default withLogin(MyCoupons);
