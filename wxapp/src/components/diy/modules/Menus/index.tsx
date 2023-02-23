import { View } from "@tarojs/components";
import utils from "../../../../lib/utils";
import FallbackImage from "../../../FallbackImage";
import Taro from "@tarojs/taro";

const MenusModule = (props: any) => {
    const { index, style, basic, imageStyle, checkLogin, ...rest } = props;
    const menus = basic.menus;
    const columns = basic.columns;

    switch (columns) {
      case 3:
        return (
          <View {...rest} style={style}>
            <View className={`grid grid-cols-3 gap-2`}>
              {menus.map((item: any, i:number) => {
                return (
                  <View className={'flex flex-col items-center relative space-y-2'} onClick={()=>utils.gotoLink(item.url)} key={'menus'+index+''+i}>
                    {item.badge && <View className='cu-tag badge' style={{top: Taro.pxTransform(7), right: Taro.pxTransform(10)}}>{item.badge}</View>}
                    <FallbackImage style={{...imageStyle}} mode={'aspectFit'} src={utils.resolveUrl(item.image)} />
                    <View>{item.text}</View>
                  </View>
                );
              })}
            </View>
          </View>
        );
      case 4:
        return (
          <View {...rest} style={style}>
            <View className={`grid grid-cols-4 gap-4`}>
              {menus.map((item: any, i:number) => {
                return (
                  <View className={'flex flex-col items-center relative space-y-2'} onClick={()=>utils.gotoLink(item.url)} key={'menus'+index+''+i}>
                    {item.badge && <View className='cu-tag badge' style={{top: Taro.pxTransform(7), right: Taro.pxTransform(10)}}>{item.badge}</View>}
                    <FallbackImage style={{...imageStyle}} mode={'aspectFit'} src={utils.resolveUrl(item.image)} />
                    <View>{item.text}</View>
                  </View>
                );
              })}
            </View>
          </View>
        );
      case 5:
        return (
          <View {...rest} style={style}>
            <View className={`grid grid-cols-5 gap-2`}>
              {menus.map((item: any, i:number) => {
                return (
                  <View className={'flex flex-col items-center relative space-y-2'} onClick={()=>utils.gotoLink(item.url)} key={'menus'+index+''+i}>
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

}

export default MenusModule;
