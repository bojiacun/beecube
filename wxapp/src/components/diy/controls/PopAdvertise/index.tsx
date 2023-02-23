import {View, Text, Image} from "@tarojs/components";
import {resolveUrl} from "../../../../utils/request";
import Taro from "@tarojs/taro";
import {useEffect, useState} from "react";
import _ from "lodash";


const PopAdvertise = (props: any) => {
    const { data, basic, style, ...rest } = props;
    const [hide, setHide] = useState<boolean>(true);

    useEffect(()=>{
        let exists = _.indexOf(Taro.getStorageSync("CLOSED_URLS"), basic.link);
        setHide(exists>=0);
    },[basic]);

    const closeAdv = () => {
        setHide(true);
        let closedLinks = Taro.getStorageSync("CLOSED_URLS") || [];
        closedLinks.push(basic.link);
        Taro.setStorageSync('CLOSED_URLS', closedLinks);
    }
    if(hide) {
        return <></>
    }

    const navigateToCouponDetail = () => {
        Taro.navigateTo({url: basic.link}).then(closeAdv);
    }

    return (
        <View {...rest}  style={{width: '100vw',zIndex: 99999, height: '100vh', top: 0, left: 0, position: 'fixed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `rgba(0,0,0,${style.opacity})`}}>
            <View style={{width: '50%', position: 'relative', opacity: 1}}>
                <Image mode={'widthFix'} src={resolveUrl(basic.image)} style={{width: '100%', display: 'block'}} onClick={navigateToCouponDetail} />
                <View style={{marginTop: Taro.pxTransform(20), textAlign: 'center', color: 'white', fontSize: Taro.pxTransform(24), cursor: 'pointer'}}><Text className="cuIcon-close" onClick={closeAdv} /></View>
            </View>
        </View>
    );
};

export default PopAdvertise;
