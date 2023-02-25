import { Image } from "@tarojs/components";
import defaultImage from '../../assets/images/img.jpg';

const FallbackImage = (props:any) => {
    const {mode = "aspectFit", style = {}, errorImage = null} = props;
    const url = props.src;
    if(!url) {
        return <Image src={errorImage || defaultImage} mode={mode} style={style} />
    }
    return <Image src={url} mode={mode} style={style} />
}

export default FallbackImage;
