import { View } from "@tarojs/components";



const GoodsListModule = (props: any) => {
    const { index, basic, style, ...rest } = props;

    return (
        <View {...rest} style={{...style, height: basic.height}}></View>
    );
}

export default GoodsListModule;
