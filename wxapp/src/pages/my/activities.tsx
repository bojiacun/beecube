import {useState} from "react";
import Taro, {useReachBottom, useReady} from '@tarojs/taro';
import withLogin from "../../components/login/login";
import PageLayout from "../../layouts/PageLayout";
import {View, Text, Button} from "@tarojs/components";
import Empty from "../../components/empty/empty";
import request, {
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
import classNames from "classnames";
import NotLogin from "../../components/notlogin";
import moment from "moment";
import ContentLoading from "../../components/contentloading";


const MyActivities = (props) => {
    const {checkLogin} = props;
    const [page, setPage] = useState<number>(1);
    const [over, setOver] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<any[]>([]);

    const isLogin = checkLogin();


    const loadData = (clear = false, page = 1) => {
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/activity/records/my/works", SERVICE_WINKT_SYSTEM_HEADER, {page: page}, true).then(res=>{
            setLoadingMore(false);
            let _list = res.data.data.content;
            if (clear) {
                setOver(false);
                setList(_list);
            } else {
                if(!_list || _list.length === 0) {
                    setOver(true);
                }
                else {
                    setList([...list, ..._list]);
                }
            }
            setLoading(false);
        }).catch(()=>{
            setLoadingMore(false)
            setLoading(false);
        })
    }
    useReady(()=>{
        if(isLogin) {
            setLoading(true);
            loadData(true);
        }
    });
    useReachBottom(()=>{
        if(!over) {
            setLoadingMore(true);
            loadData( false, page+1);
        }
    });

    const requestRefund = (item: any) => {
        request.put("wxapp/activity/records/refund/" + item.id, SERVICE_WINKT_SYSTEM_HEADER, null, true).then((res:any) => {
            if(res.data.data) {
                Taro.showModal({title: '温馨提示', content: '退款成功', showCancel: false}).then(res=>{
                    if(res.confirm) {
                        loadData();
                    }
                });
            }
        });
    }

    return (
        <PageLayout statusBarProps={{title: '我参与的活动'}}>
            {!isLogin && <NotLogin onLogin={()=>loadData(true)} />}
            {isLogin && loading && <ContentLoading height='calc(100vh - 100rpx)' />}
            {!loading && isLogin && list.length === 0 && <Empty title="暂无明细" />}
            {!loading && isLogin && list.length > 0 &&
                <View className="cu-list menu">
                    {list.map((item:any)=>{
                        return (
                            <View className="cu-item" style={{paddingTop: Taro.pxTransform(10), paddingBottom: Taro.pxTransform(10)}}>
                                <View className="content">
                                    <View className="text-bold"><Text className={'margin-right-sm'}>{item.activity.name}</Text>
                                        {item.activity.type == 1 && <Text className="cu-tag bg-orange round">图片类</Text>}
                                        {item.activity.type == 2 && <Text className="cu-tag bg-red round">视频类</Text>}
                                        {item.activity.type == 3 && <Text className="cu-tag bg-green round">报名类</Text>}
                                    </View>
                                    <View className="text-gray">{moment(item.createdAt).format("yyyy-MM-DD HH:mm:ss")}</View>
                                </View>
                                <View className="action flex flex-direction justify-center align-center">
                                    {item.payed > 0 && !item.status && <Button className={'cu-btn sm bg-green'} onClick={()=>requestRefund(item)} style={{width: Taro.pxTransform(40)}}>退款</Button>}
                                    {item.payed > 0 && <Text className='text-red'>已支付: {item.payed}</Text>}
                                </View>
                            </View>
                        );
                    })}
                </View>
            }
            <View className={classNames("cu-load text-gray", over ? 'over': (loadingMore ? 'loading': ''))} />
            <View style={{height: '140rpx'}}/>
        </PageLayout>
    );
}

export default withLogin(MyActivities);
