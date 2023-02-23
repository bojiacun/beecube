import { View } from "@tarojs/components";
import utils from "../../../../lib/utils";
import FallbackImage from "../../../FallbackImage";
import Taro from "@tarojs/taro";

const MenusModule = (props: any) => {
    const { index, style, basic, imageStyle, checkLogin, ...rest } = props;
    const menus = basic.menus;

    return (
        <View {...rest} style={style}>
            {basic.showTitle && <View style={{paddingLeft: '30rpx', borderBottom: '2rpx solid #f5f5f5', marginBottom: '10rpx'}}>
                <View className="text-lg margin-bottom-sm">{basic.title}</View>
            </View>}
            <View style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
                {menus.map((item: any, i:number) => {
                    return (
                        <View className={'margin-bottom-sm'} onClick={()=>utils.gotoLink(item.url)} key={'menus'+index+''+i} style={{ width: 100 / parseInt(basic.columns) + '%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {item.badge && <View className='cu-tag badge' style={{top: Taro.pxTransform(7), right: Taro.pxTransform(10)}}>{item.badge}</View>}
                            <FallbackImage style={{...imageStyle}} mode={'aspectFit'} src={utils.resolveUrl(item.image)} />
                            <View>{item.text}</View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

export default MenusModule;
