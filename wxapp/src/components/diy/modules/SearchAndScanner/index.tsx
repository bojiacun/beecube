import {View, Navigator, Text} from "@tarojs/components";

const SearchAndScanner = (props: any) => {
    let {style, inputStyle, buttonStyle, basic, makeLogin, ...rest} = props;

    return (
        <View style={style} {...rest}>
            <Navigator url={'/pages/index/search'} className={'rounded-lg border border-gray-400 p-4'}>
                <View className={'text-gray-400'}><Text className={'fa fa-search'} /></View>
                <Text className='text-gray-300'>{basic.placeholder}</Text>
            </Navigator>
        </View>
    );
}
export default SearchAndScanner;
