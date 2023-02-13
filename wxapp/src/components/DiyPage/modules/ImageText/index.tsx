import { View } from "@tarojs/components";
import util from "../../../../utils/we7/util";
import { resolveUrl } from "../../../../utils/request";
import FallbackImage from "../../../FallbackImage";


const ImageText = (props: any) => {
    let {style, basic, ...rest} = props;
    style = util.convertWebStyle(style);
    return (
        <View {...rest} style={style} onClick={()=>util.gotoLink(basic.url)}>
            <FallbackImage src={resolveUrl(basic.image)} style={{width: '100%'}} />
            <View style={{ marginTop: '16rpx', lineHeight: 1.5 }}>{basic.description}</View>
        </View>
    );
}

export default ImageText;
