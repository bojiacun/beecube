import { View,Image } from "@tarojs/components";
import utils from "../../../../lib/utils";
import FallbackImage from "../../../FallbackImage";
import Taro from '@tarojs/taro';

const SingleImageModule = (props: any) => {
    const { index, basic, style, ...rest } = props;

    return (
        <View {...rest} style={style} onClick={()=>utils.gotoLink(basic.url)}>
            {basic.showTitle&&
            <View style={{
                position: 'relative',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>

                <Image src={'../../assets/images/designer/biaoqian.png'} mode="widthFix" style={{ display: 'block', width: '50%', position: 'absolute', zIndex: 0 }} />
                <View className="text-lg" style={{ zIndex: 1, fontSize: Taro.pxTransform(basic.fontSize), marginBottom: '40rpx' }}>{basic.title}</View>
            </View>
            }

            <FallbackImage src={utils.resolveUrl(basic.image)} style={{ width: '100%', objectFit: 'cover' }} width={'100%'}  />
        </View>
    );
}


export default SingleImageModule;
