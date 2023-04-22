import {View} from "@tarojs/components";
import CustomSwiper from "../../../../components/swiper";

const SwiperModule = (props: any) => {
    const {index, style, basic, imageStyle, ...rest} = props;
    return (
        <View {...rest} style={style}>
            {basic.showTitle &&
                <View style={{paddingLeft: '30rpx', borderBottom: '2rpx solid #f5f5f5', marginBottom: '10rpx'}}>
                    <View className="text-lg margin-bottom-sm">{basic.title}</View>
                </View>}
            <CustomSwiper list={basic.images} radius={'0'} height={basic.height} imageMode={basic.mode} />
        </View>
    );
}

export default SwiperModule;
