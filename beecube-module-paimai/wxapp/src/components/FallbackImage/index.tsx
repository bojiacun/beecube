import { Image } from "@tarojs/components";
import defaultImage from '../../assets/images/img.jpg';

const FallbackImage = (props:any) => {
    const {mode = "aspectFit", style = {}, errorImage = null, src, ...rest} = props;
    const url = src;
    if(!url || url === '') {
        return <Image src={errorImage || defaultImage} mode={mode} style={style} {...rest} />
    }
    return <Image src={url} mode={mode} style={style} {...rest} />
}

export default FallbackImage;
