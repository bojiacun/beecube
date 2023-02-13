import {useState} from "react";
import Taro, {useDidShow} from '@tarojs/taro';
import withLogin from "../../components/login/login";
import PageLayout from "../../layouts/PageLayout";
import {View, Text, ITouchEvent, Button, Navigator} from "@tarojs/components";
import Empty from "../../components/empty/empty";
import request, {API_MEMBER_ADDRESS, API_MEMBER_ADDRESS_DELETE, SERVICE_WINKT_MEMBER_HEADER} from "../../utils/request";
import classNames from "classnames";


const Address = (props) => {
    const {headerHeight, makeLogin, checkLogin} = props;
    const [addresses, setAddresses] = useState([]);
    const [touchStart, setTouchStart] = useState(0);
    const [touchDirection, setTouchDirection] = useState<string>('');
    const [touchingItem, setTouchingItem] = useState<string>('');
    const loadData = () => {
        request.get(API_MEMBER_ADDRESS, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res => {
            setAddresses(res.data.data);
        })
    }
    const isLogined = checkLogin();


    useDidShow(() => {
        if(isLogined) {
            loadData();
        }
    });

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
    const doEdit = (e) => {
        e.stopPropagation();
        let id = e.currentTarget.dataset.id
        ;
        Taro.navigateTo({url: 'new_address?id=' + id}).then();
    }
    const doDelete = (e) => {
        e.stopPropagation();
        let id = e.currentTarget.dataset.id;
        request.del(API_MEMBER_ADDRESS_DELETE+'/'+id, SERVICE_WINKT_MEMBER_HEADER, null, true).then(() => {
            loadData();
        })
    }
    const selectAndBack = (item) => {
        Taro.setStorageSync('address', item);
        Taro.navigateBack().then();
    }


    return (
        <PageLayout statusBarProps={{title: '我的地址'}}>
            <View className="" style={{paddingBottom: '120rpx'}}>
                {addresses.length === 0 &&
                <Empty title="暂无地址" height={'calc(100vh - ' + headerHeight + 'px - 120rpx)'}/>}
                {
                    addresses.length > 0 &&
                    <View className="cu-list menu card-menu radius margin-top-sm">
                        {addresses.map((item: any) => {
                            return (
                                <View
                                    className={classNames("cu-item", touchingItem === 'touch-' + item.id ? 'move-cur' : '')}
                                    key={item.id}
                                    onTouchStart={onTouchStart}
                                    onTouchMove={onTouchMove}
                                    onTouchEnd={onTouchEnd}
                                    data-index={'touch-' + item.id}
                                    style={{height: '180rpx'}}
                                    onClick={() => selectAndBack(item)}
                                >
                                    <View className="content" style={{left: '30rpx', width: 'auto'}}>
                                        <View className="">{item.username} {item.mobile}</View>
                                        <View className="text-gray text-sm">
                                            <View>{item.province} {item.city} {item.district}</View>
                                            <View>
                                                <Text className="cuIcon-locationfill text-red"/>
                                                {item.address}
                                            </View>
                                        </View>
                                    </View>
                                    <View className="action">
                                        {Boolean(item.isDefault) &&
                                        <View className="cu-tag round bg-orange light">默认</View>}
                                    </View>
                                    <View className="move">
                                        <View className="bg-grey" onClick={doEdit} data-id={item.id}>编辑</View>
                                        <View className="bg-red" onClick={doDelete} data-id={item.id}>删除</View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                }
                <View style={{position: 'fixed', bottom: 30, width: '100%', left: 0, padding: '0 25rpx'}}>
                    {
                        !isLogined ?
                            <Button className="cu-btn bg-gradual-orange shadow block lg radius"
                                    onClick={() => makeLogin(()=>loadData())}>点击登录</Button>
                            :
                            <Navigator url="new_address"
                                       className="cu-btn bg-gradual-orange shadow block lg radius"><Text
                                className="cuIcon-add"/>添加新地址</Navigator>
                    }
                </View>
            </View>
        </PageLayout>
    );
}

export default withLogin(Address);
