import utils from "../../../../lib/utils";
import FallbackImage from "../../../FallbackImage";
import { View } from "@tarojs/components";
import Taro from '@tarojs/taro';

const MultipleImagesModule = (props: any) => {
    let { style, basic, ...rest } = props;

    basic = {...basic};

    basic.space = Taro.pxTransform(basic.space);

    return (
        <View {...rest} style={style}>
            <View {...rest} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <View style={{ flex: 1, marginRight: basic.space}} onClick={()=>utils.gotoLink(basic.url1)}>
                    <FallbackImage src={utils.resolveUrl(basic.image1)} style={{width: '100%'}} width='100%' />
                </View>
                <View style={{ flex: 1}} onClick={()=>utils.gotoLink(basic.url2)}>
                    <FallbackImage src={utils.resolveUrl(basic.image2)} style={{width: '100%'}} width='100%' />
                </View>
            </View>
            {basic.style == 2 && <>
                <View style={{ width: '100%', marginTop: basic.space}} onClick={()=>utils.gotoLink(basic.url3)}>
                    <FallbackImage src={utils.resolveUrl(basic.image3)} style={{width: '100%'}} width='100%' />
                </View>
            </>}
        </View>
    );
}

export default MultipleImagesModule;
