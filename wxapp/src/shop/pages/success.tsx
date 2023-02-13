import PageLayout from "../../layouts/PageLayout";
import {View, Text, Navigator} from "@tarojs/components";
import withLogin from "../../components/login/login";


const OrderSuccess = () => {
    return (
        <PageLayout showStatusBar={true} showTabBar={false} statusBarProps={{title: '下单结果'}}>
            <View className="bg-white padding flex flex-direction align-center" style={{height: 'calc(100vh - 200rpx)'}}>
                <View className="margin"><Text className="cuIcon-roundcheckfill text-green" style={{fontSize: '256rpx'}} /></View>
                <View className="text-center text-orange text-bold margin" style={{fontSize: '64rpx'}}>下单成功</View>
                <View className="flex margin">
                    <Navigator className="cu-btn margin-right" url="/pages/index/index" openType="switchTab">返回首页</Navigator>
                    <Navigator className="cu-btn bg-gradual-orange" url={'orders?tab=1'} openType="redirect">查看订单</Navigator>
                </View>
            </View>
        </PageLayout>
    );
}

export default withLogin(OrderSuccess);
