import {useRouter} from "@tarojs/taro";
import {WebView} from "@tarojs/components";


const IndexH5 = () => {
    const {params} = useRouter();
    const url = params.url;
    return (<WebView src={url!} style={{width: '100vw', height: '100vh', overflow: 'auto'}} />);
}

export default IndexH5
