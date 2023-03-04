import {Navigator, View} from "@tarojs/components";
import FallbackImage from "../FallbackImage";
import {FC} from "react";


export interface AuctionGoodsItemProps extends Partial<any> {
    data: any;
}

const AuctionGoodsItem : FC<AuctionGoodsItemProps> = (props) => {
    const {data, ...rest} = props;
    return (
        <View {...rest}>
            <Navigator url={'/pages/goods/detail?id='+data.id}>
                <FallbackImage mode={'widthFix'} className={'rounded block w-full'} src={data.images.split(',')[0]}/>
                <View className={'px-2 mt-2'}>{data.title}</View>
                <View className={'px-2 mb-2'}>RMB {data.startPrice}</View>
            </Navigator>
        </View>
    );
}

export default AuctionGoodsItem;
