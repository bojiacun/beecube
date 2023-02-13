import {useReachBottom, useDidShow} from '@tarojs/taro';
import classNames from "classnames";
import withLogin from "../../components/login/login";
import PageLayout from "../../layouts/PageLayout";
import {Image, Navigator, Text, View} from "@tarojs/components";
import {useState} from "react";
import request, {
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
// @ts-ignore
import styles from './index.module.scss';
import util from '../../utils/we7/util';


const ActivityList = (props:any) => {
    const {context} = props;
    const {userInfo} = context;
    const [over, setOver] = useState(false);
    const [goods, setGoods] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const loadData = (clear = false, page = 1) => {
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/activities", SERVICE_WINKT_SYSTEM_HEADER, {page: _page, "site_id":userInfo?.memberInfo?.siteId??0}).then(res=>{
            setLoadingMore(false);
            let list = res.data.data.content;
            if (clear) {
                setOver(false);
                setGoods(list);
            } else {
                if(!list || list.length === 0) {
                    setOver(true);
                }
                else {
                    setGoods([...goods, ...list]);
                }
            }
        })

    }

    useDidShow(()=>{
        loadData(true);
    });


    useReachBottom(()=>{
        if(!over) {
            setLoadingMore(true);
            loadData( false, page+1);
        }
    });



    return (
        <PageLayout showTabBar={false} statusBarProps={{title: '火爆活动'}}>
            <View className={classNames(styles.flowWrapper)}>
                {goods.map((item:any)=>{
                    return (
                        <Navigator url={`detail?id=${item.id}`} className={classNames(styles.flow, 'shadow shadow-lg radius-lg bg-white')}>
                            <Image src={util.resolveUrl(item.image)} mode="widthFix" className='radius-lg' />
                            <View className="padding-left-sm padding-right-sm text-lg padding-top-xs">{item.name}</View>
                            <View className="padding-bottom-xs padding-left-sm padding-right-sm flex justify-between align-center">
                                <Text className="text-orange">免费参与</Text>
                            </View>
                        </Navigator>
                    );
                })}
            </View>
            <View className={classNames("cu-load text-gray", over ? 'over': (loadingMore ? 'loading': ''))} />
            <View style={{height: '128rpx'}} />
        </PageLayout>
    );
}

export default withLogin(ActivityList);
