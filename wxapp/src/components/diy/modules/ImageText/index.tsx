import { View } from "@tarojs/components";
import FallbackImage from "../../../FallbackImage";
import utils from "../../../../lib/utils";


const ImageText = (props: any) => {
    let {style, basic, ...rest} = props;
    style = utils.convertWebStyle(style);

    return (
        <View {...rest} style={style} onClick={()=>utils.gotoLink(basic.url)}>
            <FallbackImage src={utils.resolveUrl(basic.image)} style={{width: '100%'}} />
            <View style={{ marginTop: '16rpx', lineHeight: 1.5 }}>{basic.description}</View>
        </View>
    );
}

export default ImageText;
