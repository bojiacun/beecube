import { useEffect, useState } from "react";
import request, { API_SITE_NOTICES, SERVICE_WINKT_SYSTEM_HEADER } from "../../utils/request";
import PageLayout from "../../layouts/PageLayout";
import { View, Text, Navigator } from "@tarojs/components";
import classNames from "classnames";
import withLogin from "../../components/login/login";
import { usePullDownRefresh, useReachBottom } from "@tarojs/taro";
import moment from "moment";


const HelpIndex = (props: any) => {
    const { checkLogin, context } = props;
    const [notices, setNotices] = useState<any>([]);
    const isLogin = checkLogin();
    const [page, setPage] = useState(1);
    const [over, setOver] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [siteName, setSiteName] = useState<string>();


    const loadNotices = (clear = false, page = 1) => {
        if (isLogin) {
            const _page = clear ? 1 : page;
            setPage(_page);
            let siteId = context.userInfo.memberInfo.siteId;
            setSiteName(context.userInfo.memberInfo.siteName);
            if (parseInt(siteId) > 0) {
                request.get(API_SITE_NOTICES + '/' + siteId, SERVICE_WINKT_SYSTEM_HEADER).then(res => {
                    setLoadingMore(false);
                    let list = res.data.data.content;
                    if (clear) {
                        setOver(false);
                        setNotices(list);
                    } else {
                        if(!list || list.length === 0) {
                            setOver(true);
                        }
                        else {
                            setNotices([...notices, ...list]);
                        }
                    }
                    setLoading(false);
                }).catch(()=>{
                    setLoadingMore(false)
                    setLoading(false);
                });
            }
        }
    }
    useEffect(()=>{
        loadNotices(true);
    },[]);
    usePullDownRefresh(()=>{
        setLoading(true);
        loadNotices(true);
        setOver(false);
    });
    useReachBottom(()=>{
        if(!over && isLogin) {
            setLoadingMore(true);
            loadNotices(false, page+1);
        }
    });

    return (
        <PageLayout loading={loading} statusBarProps={{ title: `${siteName}的公告` }} style={{ minHeight: '100vh', backgroundColor: 'white' }}>
            <View className="cu-list menu">
                {notices.map((item: any) => {
                    return (
                        <Navigator url={`detail?id=${item.id}`} className="cu-item flex-wrap">
                            <View className="content">
                                <View>{item.title}</View>
                                <View className="text-gray text-sm">{moment(item.createdAt).format('yyyy-MM-DD HH:mm:ss')}</View>
                            </View>
                            <View className="action">
                                <Text className={classNames("cuIcon-right", "text-gray")} style={{ display: 'block', fontSize: '36rpx' }} />
                            </View>
                        </Navigator>
                    );
                })}
            </View>
            <View className={classNames("cu-load text-gray", over ? 'over': (loadingMore ? 'loading': ''))} />
            <View style={{height: '198rpx'}} />
        </PageLayout>
    );
}


export default withLogin(HelpIndex);