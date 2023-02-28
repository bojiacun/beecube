import {View} from "@tarojs/components";
import FallbackImage from "../FallbackImage";


export interface GoodsItemViewProps extends Partial<any> {

}

const GoodsItemView = () => {
    return (
        <View className={'bg-white rounded-lg shadow-lg overflow-hidden'}>
            <FallbackImage className={'block'} mode={'widthFix'} />
        </View>
    );
}

export default GoodsItemView;
