import {View} from "@tarojs/components";
import {FC, useEffect, useState} from "react";

export interface LoadMoreProps extends Partial<any> {
    loading?: boolean;
    noMore?: boolean;
}

const LoadMore: FC<LoadMoreProps> = (props) => {
    const {loading = false, noMore = false} = props;
    const [show, setShow] = useState<boolean>(false);
    let text = '加载更多';
    if(loading) {
        text = '加载中...';
    }
    if(noMore) {
        text = '没有更多了';
    }

    useEffect(()=>{
        setShow(true);
    }, [loading]);

    if(!show) {
        return <></>;
    }


    return (
        <View className={'text-center text-gray-400 py-8 w-full'}>{text}</View>
    );
}

export default LoadMore;
