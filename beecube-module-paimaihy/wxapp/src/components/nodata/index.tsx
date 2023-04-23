import {View} from "@tarojs/components";
import {FC} from "react";

export interface NoDataProps extends Partial<any> {
    text?: string;
}

const NoData: FC<NoDataProps> = (props:any) => {
    const {text = '暂无数据', ...rest} = props;
    return (
        <View className={'text-center mt-20 text-gray-300'} {...rest}>
            <View className={'iconfont icon-zanwushuju text-9xl'} />
            <View>{text}</View>
        </View>
    );
};
export default NoData;
