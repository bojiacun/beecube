import {useState} from "react";
import {useDidShow} from '@tarojs/taro';
import withLogin from "../../components/login/login";
import PageLayout from "../../layouts/PageLayout";
import {Button, View, Text} from "@tarojs/components";
import Empty from "../../components/empty/empty";
import request, {
    SERVICE_WINKT_MEMBER_HEADER
} from "../../utils/request";
import classNames from "classnames";
import NotLogin from "../../components/notlogin";
import moment from "moment";


const MyDepositsList = (props) => {
    const {headerHeight, checkLogin} = props;
    const [orders, setOrders] = useState([]);
    const loadData = () => {
        request.get("wxapp/levels/myvips", SERVICE_WINKT_MEMBER_HEADER, null, true).then(res => {
            setOrders(res.data.data);
        })
    }
    const isLogined = checkLogin();
    useDidShow(() => {
        if (isLogined) {
            loadData();
        }
    });
    const requestRefund = (item: any) => {
        request.put("wxapp/levels/refund/" + item.id, SERVICE_WINKT_MEMBER_HEADER, null, true).then(() => {
            loadData();
        });
    }
    return (
        <PageLayout statusBarProps={{title: '押金记录'}}>
            {!isLogined && <NotLogin onLogin={() => loadData()}/>}
            {isLogined &&
                <View className="" style={{paddingBottom: '120rpx'}}>
                    {orders.length === 0 &&
                        <Empty title="暂无押金记录" height={'calc(100vh - ' + headerHeight + 'px - 120rpx)'}/>}
                    {
                        orders.length > 0 &&
                        <View className="cu-list menu card-menu radius margin-top-sm">
                            {orders.map((item: any) => {
                                return (
                                    <View
                                        className={classNames("cu-item")}
                                        key={item.id}
                                    >
                                        <View className="content padding-top-sm padding-bottom-sm">
                                            <View className="">{item.level.siteName}</View>
                                            <View className="text-red">
                                                <View>已缴纳押金：￥{item.level.deposit}</View>
                                            </View>
                                            <View className="text-gray text-sm">
                                                <View>支付时间：{moment(item.payedAt).format("YYYY-MM-DD HH:mm:ss")}</View>
                                            </View>
                                        </View>
                                        <View className='action'>
                                            {item.refundStatus == -1 && <Button onClick={() => requestRefund(item)}
                                                                                className='cu-btn bg-orange sm radius'>申请退款</Button>}
                                            {item.refundStatus == 0 && <Text className='cu-tag line-gray'>已拒绝</Text>}
                                            {item.refundStatus == 1 && <Text className='cu-tag line-orange'>审核中</Text>}
                                            {item.refundStatus == 2 && <Text className='cu-tag line-green'>已退款</Text>}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    }
                </View>
            }
        </PageLayout>
    );
}

export default withLogin(MyDepositsList);
