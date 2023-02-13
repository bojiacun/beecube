import util from "../../../../utils/we7/util";
import { resolveUrl } from "../../../../utils/request";
import FallbackImage from "../../../FallbackImage";
import { View } from "@tarojs/components";

const MultipleImagesModule = (props: any) => {
    let { style, basic, ...rest } = props;

    basic = {...basic};

    basic.space = util.px2rpx(basic.space);

    return (
        <View {...rest} style={style}>
            <View {...rest} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <View style={{ flex: 1, marginRight: basic.space}} onClick={()=>util.gotoLink(basic.url1)}>
                    <FallbackImage src={resolveUrl(basic.image1)} style={{width: '100%'}} width='100%' />
                </View>
                <View style={{ flex: 1}} onClick={()=>util.gotoLink(basic.url2)}>
                    <FallbackImage src={resolveUrl(basic.image2)} style={{width: '100%'}} width='100%' />
                </View>
            </View>
            {basic.style == 2 && <>
                <View style={{ width: '100%', marginTop: basic.space}} onClick={()=>util.gotoLink(basic.url3)}>
                    <FallbackImage src={resolveUrl(basic.image3)} style={{width: '100%'}} width='100%' />
                </View>
            </>}
        </View>
    );
}

export default MultipleImagesModule;