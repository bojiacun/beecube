import {View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import FallbackImage from "../../../FallbackImage";
import {FC} from "react";
import utils from "../../../../lib/utils";


export interface AuctionItemViewProps extends Partial<any> {
    radius?: number;
    item: any;
    width?: any;
    height?: any;
}

const ArticleItemView: FC<AuctionItemViewProps> = (props) => {
    const {radius = 0, item, width = '90%', height = 200} = props;

    const jump2Detail = () =>{
        if(item.type == 2){
            //跳转到视频播放页面
            Taro.navigateTo({url: '/articles/pages/detail2?id='+item.id});
        }
        else {
            Taro.navigateTo({url: '/articles/pages/detail?id='+item.id});
        }
    }

    return (
        <View onClick={jump2Detail} className={'bg-white relative flex flex-col flex-none overflow-hidden'} style={{borderRadius: Taro.pxTransform(radius), width: width, height: height}}>
            <View className={'relative flex-1'}>
                <FallbackImage mode={'aspectFill'} className={'block w-full h-full'} src={utils.resolveUrl(item.preview2)}/>
            </View>
            <View className={'p-4 text-xl font-bold'}>{item.title}</View>
        </View>
    );
}
export default ArticleItemView;
