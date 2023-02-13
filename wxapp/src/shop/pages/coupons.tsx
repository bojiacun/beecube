import PageLayout from "../../layouts/PageLayout";
import {useState} from "react";
import Taro, {useReady} from "@tarojs/taro";
import withLogin from "../../components/login/login";
import {View, Text, Button} from "@tarojs/components";
import './coupons.scss'
import moment from "moment";


const AvailableCoupons = () => {
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState<any[]>([]);

    const loadData = () => {
        setRecords(Taro.getStorageSync("AVAILABLE_COUPONS") || []);
    }
    useReady(() => {
        setLoading(true);
        loadData();
    });

    const useCoupon = (coupon) => {
        Taro.setStorageSync("USED_COUPON", coupon);
        Taro.navigateBack().then();
    }

    const notUse = () => {
        Taro.removeStorageSync("USED_COUPON");
        Taro.navigateBack().then();
    }

    return (
        <PageLayout showTabBar={false} pageLoading={loading} showStatusBar={true} statusBarProps={{title: '可用优惠券'}}>
            <View className={'container'} style={{paddingTop: Taro.pxTransform(20)}}>
                {records.map((item: any) => {
                    return (
                        <View className="stamp stamp01" onClick={()=>useCoupon(item)}>
                            <View className="par">
                                <View>{item.coupon.name}</View>
                                <Text className="sign">￥</Text>
                                <Text className='span'>{item.coupon.amount.toFixed(2)}</Text>
                                <Text className='sub'>元</Text>
                                <View>订单满{item.coupon.minConsume.toFixed(2)}元</View>
                            </View>
                            <View className="copy">有效期<View>{moment(item.endAt).format("YYYY-MM-DD")}</View></View>
                            <Text className={'i'} />
                        </View>
                    );
                })}
                <View style={{height: '128rpx'}} />
                <Button onClick={notUse} className={'cu-btn lg block bg-white'} style={{position: 'fixed', left: 0, right: 0, bottom: 0, marginBottom: 'calc(env(safe-area-inset-bottom) / 2)'}}>不使用优惠券</Button>
            </View>
        </PageLayout>
    );
}

export default withLogin(AvailableCoupons);
