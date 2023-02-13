import {Button, Image, View, Navigator, Text} from "@tarojs/components";
import util from "../../../../utils/we7/util";
import Taro from "@tarojs/taro";
import withLogin from "../../../login/login";
import {isBindSite} from "../../../../global";

const SearchAndScanner = (props: any) => {
    let {style, inputStyle, buttonStyle, basic, makeLogin, ...rest} = props;
    style = util.convertWebStyle(style);
    inputStyle = util.convertWebStyle(inputStyle);
    buttonStyle = util.convertWebStyle(buttonStyle);


    const startScan = () => {
        if(parseInt(basic.type) === 1) {
            //如果是扫码购书,先让用户选择是哪个门店,然后再执行扫码逻辑
            Taro.navigateTo({url: '/pages/site/index?action=select'}).then();
        }
        else if(parseInt(basic.type) === 2) {
            makeLogin((userInfo)=>{
                if(!isBindSite(userInfo)) {
                    Taro.navigateTo({url: '/pages/site/index?action=bind'}).then();
                }
                else {
                    //绑定了门店则直接跳转到我的书袋
                    Taro.navigateTo({url: '/subscribe/pages/cart?action=scan'}).then();
                }
            });
        }
    }

    return (
        <View style={{...style, display: 'flex'}} {...rest}>
            <Navigator url={'/pages/index/search?type='+basic.type} style={inputStyle}>
                <Image src='../../assets/images/sousuo.png' style={{width: util.px2rpx(18), maxHeight: '36rpx'}} mode={'widthFix'} />
                <Text className='text-gray'>{basic.placeholder}</Text>
            </Navigator>
            <View style={{marginLeft: util.px2rpx(10)}}>
                <Button onClick={startScan} style={{...buttonStyle, fontSize: '32rpx', color: '#333'}}><Text className='cuIcon-scan' />{basic.buttonText}</Button>
            </View>
        </View>
    );
}
export default withLogin(SearchAndScanner);
