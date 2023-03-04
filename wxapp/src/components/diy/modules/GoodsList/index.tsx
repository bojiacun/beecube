import { View } from "@tarojs/components";



const GoodsListModule = (props: any) => {
    const { index, basic, style, ...rest } = props;

    console.log(basic);
    return (
        <View {...rest} style={{...style}}>

        </View>
    );
}

export default GoodsListModule;
