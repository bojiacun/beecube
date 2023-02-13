import PageLayout from "../../layouts/PageLayout";
import {Navigator, Text, View} from "@tarojs/components";
import {useState} from "react";
import withLogin from "../../components/login/login";
import NotLogin from "../../components/notlogin";
import Empty from "../../components/empty/empty";
import request, {SERVICE_WINKT_LIVE_HEADER} from "../../utils/request";
import {useReachBottom, useReady} from "@tarojs/taro";
import classNames from "classnames";
import moment from "moment";


const MyLivesPage = (props) => {
    const {checkLogin} = props;
    const [page, setPage] = useState<number>(1);
    const [over, setOver] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState<any[]>([]);
    const isLogin = checkLogin();


    const loadData = (clear = false, page = 1) => {
        if (!isLogin) return;
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/lives/my", SERVICE_WINKT_LIVE_HEADER, {page: page}, true).then(res => {
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
        <PageLayout statusBarProps={{title: '我的付费直播'}} loading={loading}>
            {!isLogin && <NotLogin onLogin={() => loadData()}/>}
            {isLogin && records.length === 0 && <Empty title="暂无已付费的直播"/>}
            {isLogin && records.length > 0 &&
                <View className={'cu-list menu card-menu radius padding-top'}>
                    {records.map((item: any) => {
                        return (
                            <Navigator url={`/live/pages/detail?id=${item.history.id}`} className={'cu-item'}>
                                <View className={'cu-content margin-top-sm margin-bottom-sm'}>
                                    <View className={'text-lg margin-bottom-sm'}>{item.history.name}</View>
                                    <View className={'text-gray'}>{moment(item.payedAt).format("YYYY-MM-DD HH:mm:ss")}</View>
                                </View>
                                <View className={'cu-action'}>
                                    <Text className={'cuIcon-right'}/>
                                </View>
                            </Navigator>
                        );
                    })}
                </View>
            }
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>
        </PageLayout>
    );
}

export default withLogin(MyLivesPage);
