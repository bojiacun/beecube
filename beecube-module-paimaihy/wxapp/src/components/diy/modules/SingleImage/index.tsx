import {View} from "@tarojs/components";
import utils from "../../../../lib/utils";
import FallbackImage from "../../../FallbackImage";

const SingleImageModule = (props: any) => {
    const { index, basic, style, ...rest } = props;

    return (
        <View {...rest} style={style} onClick={()=>utils.gotoLink(basic.url)}>
            <FallbackImage src={utils.resolveUrl(basic.image)} style={{ width: '100%', objectFit: 'cover' }} width={'100%'}  />
        </View>
    );
}


export default SingleImageModule;
