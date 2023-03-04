import {Navigator, View} from "@tarojs/components";
import FallbackImage from "../FallbackImage";
import classNames from "classnames";
import styles from "../../flow.module.scss";
import {FC} from "react";


export interface GoodsItemViewProps extends Partial<any> {
    data: any;
}

const GoodsItemView : FC<GoodsItemViewProps> = (props) => {
    const {data} = props;
    return (
        <View className={classNames('bg-white rounded-lg overflow-hidden rounded shadow-outer', styles.flow)}>
            <Navigator url={'/pages/goods/detail?id='+data.id}>
                <FallbackImage mode={'widthFix'} className={'rounded block w-full'} src={data.images.split(',')[0]}/>
                <View className={'px-2 mt-2'}>{data.title}</View>
                <View className={'px-2 mb-2'}>RMB {data.startPrice}</View>
            </Navigator>
        </View>
    );
}

export default GoodsItemView;
