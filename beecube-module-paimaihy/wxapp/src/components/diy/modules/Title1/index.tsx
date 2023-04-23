import {View, Navigator} from "@tarojs/components";

const Title1Module = (props: any) => {
    const {index, basic, style, ...rest} = props;
    return (
        <View {...rest} style={style}>
            {basic.style == 1 &&
                <View className={'flex justify-between items-center pl-1'} style={{
                    borderLeft: '5px solid red',
                    backgroundImage: 'linear-gradient(to right, #FDEAEB, #FFFFFF)'
                }}>
                    <View className={'text-red-500 text-xl font-bold'}>{basic.text}</View>
                    <Navigator url={basic.links} className={'text-red-500'}>{basic.moreText}</Navigator>
                </View>
            }
            {basic.style == 2 &&
                <View className={'flex justify-between items-center'}>
                    <View className={'text-2xl font-bold'}>{basic.text}</View>
                    <Navigator url={basic.links}>{basic.moreText}</Navigator>
                </View>
            }
        </View>
    );
}


export default Title1Module;
