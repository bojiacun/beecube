import Taro, {useRouter} from '@tarojs/taro';
import {useEffect, useState} from "react";
import request, {
    API_APPOINTMENT_CANCEL,
    API_APPOINTMENT_INFO,
    API_APPOINTMENT_MEMBER_CONFIRM,
    SERVICE_WINKT_ORDER_HEADER
} from "../../utils/request";
import PageLayout from "../../layouts/PageLayout";
import {Button, Text, View} from "@tarojs/components";
import NotLogin from "../../components/notlogin";
import Empty from "../../components/empty/empty";
import withLogin from "../../components/login/login";
import moment from 'moment';

const OrderDetail = (props: any) => {
    const {checkLogin, headerHeight, isIpx} = props;
    const [info, setInfo] = useState<any>(null);
    const [totalMoney, setTotalMoney] = useState<number>();
    const [posting, setPosting] = useState<boolean>(false);
    const {params} = useRouter();
    const isLogin = checkLogin();

    const loadData = () => {
        request.get(API_APPOINTMENT_INFO+'/'+params.id, SERVICE_WINKT_ORDER_HEADER).then(res => {
            setInfo(res.data.data);
            let totalMoney = 0;
            res.data.data.wastes.forEach(item=>{
                totalMoney += (item.money??0)*item.count;
            });
            setTotalMoney(totalMoney);
        })
    }


    useEffect(() => {
        loadData();
        let timer = setInterval(()=>{
            loadData();
        }, 3000);
        return () => {
            clearInterval(timer);
        }
    },[])

    if (!isLogin) {
        return (
            <PageLayout statusBarProps={{title: '订单详情'}}>
                <NotLogin height={'calc(100vh - ' + headerHeight + 'px)'} onLogin={loadData}/>
            </PageLayout>
        );
    }
    if (!info) {
        return (
            <PageLayout statusBarProps={{title: '订单详情'}}>
                <Empty title="暂无数据" height={'calc(100vh - ' + headerHeight + 'px)'}/>
            </PageLayout>
        );
    }

    const cancelOrder = () => {
        //用户取消订单
        setPosting(true);
        request.put(API_APPOINTMENT_CANCEL+'/'+info.id, SERVICE_WINKT_ORDER_HEADER, null, true).then(()=>{
            Taro.showToast({title: '取消订单成功!', icon: 'success', duration: 1500}).then(()=>{
                setTimeout(()=>{
                    setPosting(false);
                    Taro.navigateBack().then();
                }, 1500);
            })
        }).catch(()=>{
            Taro.showToast({title: '订单取消失败', icon: 'none'}).then();
            setPosting(false);
        })
    }

    //用户确认订单
    const confirmOrder = () => {
        Taro.showModal({title: '友情提醒', content: '请请确保订单没有问题，确认后将无法更改', confirmText: '信息正确', cancelText: '信息不对', cancelColor: 'red', confirmColor: 'green'}).then((res)=>{
            if(res.confirm) {
                setPosting(true);
                request.put(API_APPOINTMENT_MEMBER_CONFIRM+'/'+info.id+'/confirm', SERVICE_WINKT_ORDER_HEADER, null, true).then(()=>{
                    setPosting(false);
                    Taro.showToast({title: '确认订单成功!', icon: 'success', duration: 1500}).then();
                    info.memberConfirmed = true;
                    setInfo({...info});
                }).catch(()=>{
                    Taro.showToast({title: '确认订单失败', icon: 'none'}).then();
                    setPosting(false);
                });
            }
            else if(res.cancel) {
                setPosting(true);
                request.put(API_APPOINTMENT_MEMBER_CONFIRM+'/'+info.id+'/confirmfail', SERVICE_WINKT_ORDER_HEADER, null, true).then(()=>{
                    setPosting(false);
                    Taro.showToast({title: '订单已重置，请回收员重新填写信息!', icon: 'success', duration: 1500}).then();
                    info.memberConfirmed = true;
                    setInfo({...info});
                }).catch(()=>{
                    Taro.showToast({title: '确认订单失败', icon: 'none'}).then();
                    setPosting(false);
                });
            }
        });

    }
    const doCopy = (info) => {
        Taro.setClipboardData({data: info.ordersn}).then(()=>{
            Taro.showToast({title: '复制成功', icon: 'none'}).then();
        })
    }
    return (
        <PageLayout statusBarProps={{title: '订单详情'}}>
            <View className="cu-card bg-white radius-lg margin">
                <View className="cu-bar">
                    <View className="action">
                        <Text className="cuIcon-titles text-green"/>
                        <Text className="text-bold">基本信息</Text>
                    </View>
                </View>
                <View className="cu-list menu">
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">订单编号：{info.ordersn}</Text>
                        </View>
                        <View className="action">
                            <Button className="cu-btn sm bg-gradual-green shadow" onClick={()=>doCopy(info)}>复制</Button>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">订单状态：
                                {info.status == 0 && <Text className="text-yellow">待接单</Text>}
                                {info.status == 1 && <Text className="text-green">已接单</Text>}
                                {info.status == 2 && <Text className="text-red">待支付</Text>}
                                {info.status == 3 && <Text>已完成</Text>}
                            </Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">备注：{info.note}</Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">下单时间：{moment(info.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">预约时间：{moment(info.serviceAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">接单时间：{info.peekedAt && moment(info.peekedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">支付时间：{info.payedAt && moment(info.payedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">完成时间：{info.completedAt && moment(info.completedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">取消时间：{info.canceledAt && moment(info.canceledAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="cu-card bg-white radius-lg margin" style={{marginTop: 0}}>
                <View className="cu-bar">
                    <View className="action">
                        <Text className="cuIcon-titles text-green"/>
                        <Text className="text-bold">地址信息</Text>
                    </View>
                </View>
                <View className="cu-list menu">
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">预约人：{info.username}</Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">联系电话：{info.mobile}</Text>
                        </View>
                    </View>
                    <View className="cu-item">
                        <View className="content">
                            <Text className="text-black">详细地址：{info.address}</Text>
                        </View>
                    </View>
                </View>
            </View>


            <View className="cu-card bg-white radius-lg margin" style={{marginTop: 0}}>
                <View className="cu-bar">
                    <View className="action">
                        <Text className="cuIcon-titles text-green"/>
                        <Text className="text-bold">回收员信息</Text>
                    </View>
                </View>
                {info.recyclerId ?
                    <View className="cu-list menu">
                        <View className="cu-item">
                            <View className="content">
                                <Text className="text-black">姓名：{info.recyclerName}</Text>
                            </View>
                        </View>
                        <View className="cu-item">
                            <View className="content">
                                <Text className="text-black">联系电话：{info.recyclerMobile}</Text>
                            </View>
                            {info.recyclerMobile &&
                            <View className="action">
                                <Text className="cuIcon-dianhua text-green" style={{fontSize: '36rpx'}}
                                      onClick={() => Taro.makePhoneCall({phoneNumber: info.recyclerMobile})}/>
                            </View>
                            }
                        </View>
                    </View>
                    :
                    <View className="cu-item">
                        <View className="flex align-center justify-center">
                            <Text>暂无回收员信息</Text>
                        </View>
                    </View>
                }
            </View>

            <View className="cu-card bg-white radius-lg margin" style={{marginTop: 0}}>
                <View className="cu-bar">
                    <View className="action">
                        <Text className="cuIcon-titles text-green"/>
                        <Text className="text-bold">废品信息</Text>
                    </View>
                </View>
                <View className="cu-list menu">
                    {info.wastes.map((item:any)=>{
                        return (
                            <View className="cu-item">
                                <View className="content">
                                    <Text className="text-black">{item.name} x {item.count} {item.unit} x {item.price} 元</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>

            <View className="cu-card bg-white radius-lg margin" style={{marginTop: 0}}>
                <View className="cu-bar">
                    <View className="action">
                        <Text className="cuIcon-titles text-green"/>
                        <Text className="text-bold">预计收益</Text>
                    </View>
                </View>
                <View className="cu-list menu">
                    <View className="cu-item">
                        <View className="content">
                            <View>预计收益：<Text>预计回收积分 {totalMoney}</Text></View>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{height: '140rpx'}} />
            <View style={{position: 'fixed', bottom: 0, width: '100%'}}>
                {parseInt(info.status) === 0 && <Button style={{paddingBottom: isIpx?'40rpx':'0', boxSizing: 'content-box'}} onClick={cancelOrder} disabled={posting} loading={posting} className="cu-btn bg-gradual-orange shadow block xl no-radius">取消订单</Button>}
                {parseInt(info.status) === 2 && !info.memberConfirmed &&
                    <Button style={{paddingBottom: isIpx?'40rpx':'0', boxSizing: 'content-box'}} onClick={confirmOrder} disabled={posting} loading={posting} className="cu-btn bg-gradual-red shadow block xl no-radius">确认订单</Button>
                }
            </View>
        </PageLayout>
    );
}


export default withLogin(OrderDetail)
