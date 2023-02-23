import { Image, View } from "@tarojs/components";



const SiteNoticeModule = (props: any) => {
    const {index, style, basic, ...rest} = props;
    return (
        <View {...rest} style={style}>
            <View style={{display: 'flex', minHeight: '80rpx', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: basic.background, borderRadius: basic.borderRadius}}>
                <Image src={'../../assets/images/designer/laba.png'} style={{width: '44rpx', height: '44rpx', marginLeft: '40rpx', marginRight: '20rpx'}} />
                <View>当前门店有新书上架</View>
            </View>
        </View>
    );
}

export default SiteNoticeModule;