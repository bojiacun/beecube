import {View} from "@tarojs/components";


const NoData = (props:any) => {
    const {...rest} = props;
    return (
        <View className={'text-center mt-20 text-gray-300'} {...rest}>
            <View className={'iconfont icon-zanwushuju text-9xl'} />
            <View>暂无数据</View>
        </View>
    );
};
export default NoData;
