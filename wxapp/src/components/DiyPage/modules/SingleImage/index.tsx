import { View,Image } from "@tarojs/components";
import util from "../../../../utils/we7/util";
import { resolveUrl } from "../../../../utils/request";
import FallbackImage from "../../../FallbackImage";

const SingleImageModule = (props: any) => {
    const { index, basic, style, ...rest } = props;

    return (
        <View {...rest} style={style} onClick={()=>util.gotoLink(basic.url)}>
            {basic.showTitle&&
            <View style={{
                position: 'relative',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>

                <Image src={'../../assets/images/designer/biaoqian.png'} mode="widthFix" style={{ display: 'block', width: '50%', position: 'absolute', zIndex: 0 }} />
                <View className="text-lg" style={{ zIndex: 1, fontSize: util.px2rpx(basic.fontSize), marginBottom: '40rpx' }}>{basic.title}</View>
            </View>
            }

            <FallbackImage src={resolveUrl(basic.image)} style={{ width: '100%', objectFit: 'cover' }} width={'100%'}  />
        </View>
    );
}


export default SingleImageModule;
