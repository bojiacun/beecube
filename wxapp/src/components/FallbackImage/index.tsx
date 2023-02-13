import { Image } from "@tarojs/components";
import { useState } from "react";

const FallbackImage = (props:any) => {
    const {mode = "widthFix", style = {display: 'block', width: '100%'}} = props;
    const [url, setUrl] = useState<string>(props.src);
    return <Image src={url} mode={mode} onError={()=>setUrl('../../assets/images/img.jpg')} style={style} />
}

export default FallbackImage;