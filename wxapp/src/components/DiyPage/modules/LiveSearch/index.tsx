import {Image, View, Navigator, Text} from "@tarojs/components";
import util from "../../../../utils/we7/util";
import withLogin from "../../../login/login";

const LiveSearch = (props: any) => {
    let {style, inputStyle, buttonStyle, basic, makeLogin, ...rest} = props;
    style = util.convertWebStyle(style);
    inputStyle = util.convertWebStyle(inputStyle);
    inputStyle.lineHeight = '64rpx';


    return (
        <View style={{...style, display: 'flex'}} {...rest}>
            <Navigator url={'/live/pages/search?type='+basic.type} style={inputStyle}>
                <Image src='../../assets/images/sousuo.png' style={{width: util.px2rpx(18), maxHeight: '36rpx'}} mode={'widthFix'} />
                <Text className='text-gray'>{basic.placeholder}</Text>
            </Navigator>
        </View>
    );
}
export default withLogin(LiveSearch);
