import PageLayout from "../../layouts/PageLayout";
import {View, Text, Navigator} from "@tarojs/components";
import Taro from "@tarojs/taro";


const GivebackSuccess = () => {

    const borrowAnother = () => {
        Taro.setStorageSync("borrow_another", 1);
        Taro.switchTab({url: '/pages/index/index'}).then();
    }
    return (
        <PageLayout showStatusBar={true} showTabBar={false} statusBarProps={{title: '归还成功'}}>
            <View className="bg-white padding flex flex-direction align-center" style={{height: 'calc(100vh - 200rpx)'}}>
                <View className="margin"><Text className="cuIcon-roundcheckfill text-green" style={{fontSize: '256rpx'}} /></View>
                <View className="text-center text-red text-bold margin" style={{fontSize: '64rpx'}}>归还成功，您可以再借一本书</View>
                <View className="flex margin">
                    <Navigator className="cu-btn margin-right" url="/pages/index/index" openType="switchTab">返回首页</Navigator>
                    <View className="cu-btn bg-gradual-orange" onClick={borrowAnother} >再借一本书</View>
                </View>
            </View>
        </PageLayout>
    );
}

export default GivebackSuccess;
