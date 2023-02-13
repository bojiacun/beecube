import Taro, {useDidShow, useReachBottom} from '@tarojs/taro';
import {Button, Text, View, Input, ITouchEvent, Navigator} from "@tarojs/components";
import classNames from "classnames";
import util from '../../utils/we7/util';
import {useState} from "react";
import PageLayout from "../../layouts/PageLayout";
import request, {
    resolveUrl, SERVICE_WINKT_MEMBER_HEADER,
} from "../../utils/request";
import withLogin from "../../components/login/login";
import Empty from "../../components/empty/empty";
import ContentLoading from "../../components/contentloading";
import moment from "moment";


const MemberList = (props) => {
    const {checkLogin, makeLogin} = props;
    const [touchStart, setTouchStart] = useState(0);
    const [touchDirection, setTouchDirection] = useState<string>('');
    const [touchingItem, setTouchingItem] = useState<string>('');
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const [over, setOver] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState(1);
    const [searchKey, setSearchKey] = useState<string>('');
    const isLogin = checkLogin();


    const loadData = (clear = false, page = 1, params = {}) => {
        if (!isLogin) return;
        const _page = clear ? 1 : page;
        setPage(_page);
        request.get("wxapp/manager/members", SERVICE_WINKT_MEMBER_HEADER, {
            ...params,
            page: _page,
        }, true).then(res => {
            setLoadingMore(false);
            let list = res.data.data.content;
            if (clear) {
                setOver(false);
                setGoodsList(list);
            } else {
                if (!list || list.length === 0) {
                    setOver(true);
                } else {
                    setGoodsList([...goodsList, ...list]);
                }
            }
            setLoading(false);
        }).catch(() => {
            setLoadingMore(false);
            setLoading(false);
        })
    }

    useDidShow(() => {
        loadData(true, 1, {key: searchKey});
    });
    useReachBottom(() => {
        if (!over) {
            setLoadingMore(true);
            loadData(false, page + 1, {key: searchKey});
        }
    })

    const doSearch = util.debounce(loadData, 500);
    const handleSearchInput = (e) => {
        let key = e.detail.value;
        setSearchKey(key);
        doSearch(true, 1, {key: key});
    }

    const onTouchStart = (e: ITouchEvent) => {
        setTouchStart(e.touches[0].pageX);
    }
    const onTouchMove = (e: ITouchEvent) => {
        setTouchDirection(e.touches[0].pageX - touchStart > 0 ? 'right' : 'left');
    }
    const onTouchEnd = (e: ITouchEvent) => {
        if (touchDirection === 'left') {
            setTouchingItem(e.currentTarget.dataset.index)
        } else {
            setTouchingItem('');
        }
        setTouchDirection('');
    }

    const downMember = (item:any) => {
        item.status = false;
        Taro.showLoading({title: '下架中...'}).then();
        request.put("wxapp/manager/members/"+item.id+'/status', SERVICE_WINKT_MEMBER_HEADER, item, true).then((res)=>{
            item.status = res.data.data.status;
            setGoodsList([...goodsList]);
            Taro.hideLoading();
        }).catch(()=>Taro.hideLoading());
    }
    const upMember = (item:any) => {
        item.status = true;
        Taro.showLoading({title: '上架中...'}).then();
        request.put("wxapp/manager/members/"+item.id+'/status', SERVICE_WINKT_MEMBER_HEADER, item, true).then((res)=>{
            item.status = res.data.data.status;
            setGoodsList([...goodsList]);
            Taro.hideLoading();
        }).catch(()=>Taro.hideLoading());
    }
    return (
        <PageLayout statusBarProps={{title: '门店会员'}} showTabBar={false}>
            <View className="cu-bar search bg-white">
                <View className="search-form round">
                    <Text className="cuIcon-search"/>
                    <Input type="text" onInput={handleSearchInput} placeholder="搜索会员名称、手机号" confirm-type="search"/>
                </View>
            </View>
            {loading && <ContentLoading height='calc(100vh - 464rpx)'/>}
            {
                !isLogin ?
                    <View className='flex flex-direction align-center justify-center'
                          style={{height: 'calc(100vh - 464rpx)'}}>
                        <Button className="cu-btn bg-gradual-green block lg" style={{width: '80%'}}
                                onClick={() => makeLogin(() => loadData(true))}>登录查看</Button>
                    </View>
                    : (loading || goodsList.length === 0 ?
                        <Empty title="暂无门店会员" height='calc(100vh - 464rpx)'/> :
                        <View className="cu-list menu-avatar">{goodsList.map((item: any) => {
                            return (
                                <View
                                    className={classNames("cu-item", touchingItem === 'touch-' + item.id ? 'move-cur' : '', item.status ? '' : 'filter-gray')}
                                    onTouchStart={onTouchStart}
                                    onTouchMove={onTouchMove}
                                    onTouchEnd={onTouchEnd}
                                    data-index={'touch-' + item.id}
                                >
                                    <Navigator url={`member_detail?id=${item.id}`} className="cu-avatar round lg"
                                          style={{backgroundImage: 'url(' + resolveUrl(item.avatar) + ')'}}/>
                                    <Navigator url={`member_detail?id=${item.id}`} className="content" style={{display: 'block', padding: 0}}>
                                        <View className="text-black">
                                            <View className="text-cut">{item.nickname}</View>
                                        </View>
                                        <View className='text-gray'>
                                            <View className="text-cut">{item.realName} {item.mobile}</View>
                                        </View>
                                        <View className='text-gray'>
                                            <View className="text-cut">{moment(item.createdAt).format("yyyy-MM-DD HH:mm:ss")}</View>
                                        </View>
                                    </Navigator>
                                    <View className="action text-sm">
                                        <View className="text-red">余额：￥{item.money}</View>
                                        <View className="text-gray">大小豆：{item.score}</View>
                                    </View>
                                    <View className='move'>
                                        {item.status &&
                                            <View className='bg-red' onClick={()=>downMember(item)}>禁用</View>
                                        }
                                        {!item.status &&
                                            <View className='bg-green' onClick={()=>upMember(item)}>启用</View>
                                        }
                                    </View>
                                </View>
                            );
                        })}</View>)
            }
            <View className={classNames("cu-load text-gray", over ? 'over' : (loadingMore ? 'loading' : ''))}/>

        </PageLayout>
    );
}


export default withLogin(MemberList);
