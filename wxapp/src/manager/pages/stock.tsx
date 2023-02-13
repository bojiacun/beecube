import Taro, {useDidShow, useReachBottom, useRouter} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import withLogin from "../../components/login/login";
import {Navigator, Text, View} from "@tarojs/components";
import request, {
    API_SHOP_GOODS_INFO,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
import {useState} from "react";
import classNames from "classnames";
import ContentLoading from "../../components/contentloading";
import NotLogin from "../../components/notlogin";
import Empty from "../../components/empty/empty";
import moment from 'moment';


const StockRecord = (props) => {
    const {checkLogin} = props;
    const [page, setPage] = useState<number>(1);
    const [over, setOver] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState<any[]>([]);
    const [info, setInfo] = useState<any>();
    const {params} = useRouter();
    const isLogin = checkLogin();


    const loadData = (clear = false, page = 1) => {
        if (!isLogin) return;
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/manager/shop/goods/stocks/" + params.id, SERVICE_WINKT_SYSTEM_HEADER, {page: page}, true).then(res => {
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

    useDidShow(() => {
        if (params.id) {
            request.get(API_SHOP_GOODS_INFO + "/" + params.id, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res => {
                setInfo(res.data.data);
                setLoading(true);
                loadData(true);
            });
        }
    });
    useReachBottom(() => {
        if (!over) {
            setLoadingMore(true);
            loadData(false, page + 1);
        }
    });

    return (
        <PageLayout statusBarProps={{title: `【${info?.shortName}】库存记录`}}>
            {!isLogin && <NotLogin onLogin={() => loadData(true)}/>}
            {isLogin && loading && <ContentLoading height='calc(100vh - 100rpx)'/>}
            {!loading && isLogin && records.length === 0 && <Empty title="暂无明细"/>}
            {!loading && isLogin && records.length > 0 &&
                <View className="cu-list menu">
                    {records.map((item: any) => {
                        return (
                            <View className="cu-item">
                                <View className="content">
                                    <View className="text-bold">{item.description}</View>
                                    <View
                                        className="text-gray">{moment(item.createdAt).format("yyyy-MM-DD HH:mm:ss")}</View>
                                </View>
                                <View className="action text-right" style={{width: '200rpx'}}>
                                    {item.count > 0 ?
                                        <Text className="text-bold text-red text-xl">+{item.count}</Text> :
                                        <Text className="text-bold text-green text-xl">{item.count}</Text>}
                                </View>
                            </View>
                        );
                    })}
                </View>
            }
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>
            <View style={{height: '200rpx'}}/>
            <Navigator url={`new_stock?id=${info?.id}`} className={'cu-bar tabbar justify-center'} style={{width: '100%', position: 'fixed', bottom: 0, zIndex: 999}}>
                <View className={'bg-orange text-lg text-center shadow'} style={{width: '80%',lineHeight: Taro.pxTransform(38)}}>
                    调整库存
                </View>
            </Navigator>
        </PageLayout>
    );
}

export default withLogin(StockRecord);
