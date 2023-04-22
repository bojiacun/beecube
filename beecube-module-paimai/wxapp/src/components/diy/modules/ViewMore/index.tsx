import {Navigator, View} from "@tarojs/components";

const ViewMoreModule = (props: any) => {
    const {index, basic, style, ...rest} = props;
    return (
        <View className={'text-center'} {...rest} style={style}>
            <Navigator className={'btn btn-outline'} url={basic.links}>{basic.text}</Navigator>
        </View>
    );
}


export default ViewMoreModule;
