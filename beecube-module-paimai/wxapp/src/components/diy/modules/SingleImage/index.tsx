import {View} from "@tarojs/components";
import utils from "../../../../lib/utils";
import FallbackImage from "../../../FallbackImage";

const SingleImageModule = (props: any) => {
    const { index, basic, style, ...rest } = props;

    return (
        <View {...rest} style={style} onClick={()=>utils.gotoLink(basic.url)}>
            <FallbackImage mode={basic.mode || 'aspectFill'} src={utils.resolveUrl(basic.image)} style={{ width: '100%' }} width={'100%'}  />
        </View>
    );
}


export default SingleImageModule;
