import {useDidShow, useReachBottom} from '@tarojs/taro';
import {Button, Navigator, Text, View} from "@tarojs/components";
import classNames from "classnames";
import {useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {resolveUrl, SERVICE_WINKT_ORDER_HEADER} from "../../utils/request";
import withLogin from "../../components/login/login";
import Empty from "../../components/empty/empty";
import ContentLoading from "../../components/contentloading";


const Comments = (props) => {
    const {checkLogin, makeLogin} = props;
    const [comments, setComments] = useState<any[]>([]);
    const [over, setOver] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const isLogin = checkLogin();


    const loadData = (clear = false, page = 1) => {
        if (!isLogin) return;
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/shop/orders/notcomments", SERVICE_WINKT_ORDER_HEADER, {page: _page}, true).then(res => {
            setLoadingMore(false);
            let list = res.data.data.content;
            list.forEach(o => {
                o.goods.forEach(g => {
                    g.images = g.images.split(',');
                })
            })
            if (clear) {
                setOver(false);
                setComments(list);
            } else {
                if (!list || list.length === 0) {
                    setOver(true);
                } else {
                    setComments([...comments, ...list]);
                }
            }
            setLoading(false);
        }).catch(() => {
            setLoadingMore(false);
            setLoading(false);
        })
    }

    useDidShow(() => {
        if (isLogin) {
            setLoading(true);
            loadData(true);
        }
    });
    useReachBottom(() => {
        if (!over && isLogin) {
            setLoadingMore(true);
            loadData(false, page + 1);
        }
    })

    return (
        <PageLayout statusBarProps={{title: '待评价'}} showTabBar={false}>
            {loading && <ContentLoading height='calc(100vh - 218rpx)'/>}
            {
                !isLogin ?
                    <View className='flex flex-direction align-center justify-center'
                          style={{height: 'calc(100vh - 400rpx)'}}>
                        <Button className="cu-btn bg-gradual-orange block lg" style={{width: '80%'}}
                                onClick={() => makeLogin(() => loadData(true))}>登录查看</Button>
                    </View>
                    : (comments.length === 0 ?
                        <Empty title="暂无待评价商品" height='calc(100vh - 400rpx)'/> :
                        <View className="cu-card article">{comments.map((item: any) => {
                            return (
                                <View className="cu-item" style={{paddingBottom: 0}}>
                                    <View className="flex align-center padding solid-bottom text-gray justify-between">
                                        <Text> 门店：{item.siteName} </Text>
                                    </View>
                                    <View className="cu-list menu-avatar">
                                        {item.goods.map((g: any) => {
                                            return (
                                                <Navigator url={`new_grade?id=${g.id}`} className="cu-item">
                                                    <View className="cu-avatar radius lg"
                                                          style={{backgroundImage: 'url(' + resolveUrl(g.images[0]) + ')'}}/>
                                                    <View className="content" style={{display: 'block', padding: 0}}>
                                                        <View className="text-black">
                                                            <Text className="text-cut">{g.name}</Text>
                                                        </View>
                                                        <View className="text-red text-sm flex">
                                                            <text className="text-cut">￥{g.price.toFixed(2)}</text>
                                                        </View>
                                                    </View>
                                                </Navigator>
                                            );
                                        })}
                                    </View>
                                </View>
                            );
                        })}</View>)
            }
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>
        </PageLayout>
    );
}


export default withLogin(Comments);
