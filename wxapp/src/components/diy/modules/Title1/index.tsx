import {View, Navigator} from "@tarojs/components";

const Title1Module = (props: any) => {
    const {index, basic, style, ...rest} = props;

    console.log(basic);

    return (
        <View {...rest} style={style}>
            <View className={'flex justify-between items-center pl-1'} style={{
                borderLeft: '5px solid red',
                backgroundImage: 'linear-gradient(to right, #FDEAEB, #FFFFFF)'
            }}>
                <View className={'text-red-500 text-xl font-bold'}>{basic.text}</View>
                <Navigator url={basic.links} className={'text-red-500'}>{basic.moreText}</Navigator>
            </View>
        </View>
    );
}


export default Title1Module;
