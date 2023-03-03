import {View} from "@tarojs/components";
import {FC} from "react";

export interface LoadMoreProps extends Partial<any> {
    loading?: boolean;
    noMore?: boolean;
}

const LoadMore: FC<LoadMoreProps> = (props) => {
    const {loading = false, noMore = false} = props;
    let text = '加载更多';
    if(loading) {
        text = '加载中...';
    }
    if(noMore) {
        text = '没有更多了';
    }

    return (
        <View className={'text-center text-gray-400'}>{text}</View>
    );
}

export default LoadMore;
