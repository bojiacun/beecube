import {Navigator, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import FallbackImage from "../../../FallbackImage";
import {FC} from "react";
import utils from "../../../../lib/utils";


export interface AuctionItemViewProps extends Partial<any> {
    radius?: number;
    item: any;
}

const AuctionItemView: FC<AuctionItemViewProps> = (props) => {
    const {radius = 0, item} = props;


    return (
        <View className={'bg-white overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius)}}>
            <Navigator url={'/pages/auction/detail?id=' + item.id}>
                <View className={'relative'} style={{width: '100%'}}>
                    <FallbackImage mode={'widthFix'} style={{borderRadius: Taro.pxTransform(radius)}}
                                   className={'block w-full'} src={utils.resolveUrl(item.preview)}/>
                </View>
                <View className={'p-4 text-xl font-bold'}>{item.title}</View>
            </Navigator>
        </View>
    );
}
export default AuctionItemView;
