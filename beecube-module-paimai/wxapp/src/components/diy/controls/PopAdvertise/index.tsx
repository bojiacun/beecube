import {View, Text, Image} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {useEffect, useState} from "react";
import utils from '../../../../lib/utils';
import _ from 'lodash';
import moment from "moment";


const PopAdvertise = (props: any) => {
    const { data, basic, style, ...rest } = props;
    const [showItem, setShowItem] = useState<any>();
    const repeat = parseInt(basic.repeat);
    const repeatInterval = parseInt(basic.repeatInterval);

    useEffect(()=>{
        //拿到本次要显示的广告图
        let images = _.sortBy(basic.images, ['sort']);
        let closedImages = JSON.parse(Taro.getStorageSync("CLOSED_IMAGES") || '[]')||[];
        let nowDate = moment();
        let willShowImage = null;

        images.forEach(img=>{
            if(willShowImage != null) return;
            let cimg = _.find(closedImages, {url: img.url});
            if(cimg != null) {
                let closedDate = moment(cimg.closedAt);
                //用户已经看过该广告，判断是不是还要显示
                if (repeat == 1 && closedDate.add(repeatInterval,'hours').isBefore(nowDate)) {
                    willShowImage = img;
                }
            }
            else {
                willShowImage = img;
            }
        })
        console.log(willShowImage);
        setShowItem(willShowImage);
    },[basic]);

    const closeAdv = () => {
        showItem.closedAt = moment().format('yyyy-MM-DD HH:mm:ss');
        let closedLinks = JSON.parse(Taro.getStorageSync("CLOSED_IMAGES")||'[]') || [];
        closedLinks.push(showItem);
        Taro.setStorageSync('CLOSED_IMAGES', JSON.stringify(closedLinks));
        setShowItem(null);
    }
    if(!showItem) {
        return <></>
    }

    const navigateToCouponDetail = () => {
        Taro.navigateTo({url: showItem.url}).then(closeAdv);
    }

    return (
        <View {...rest}  style={{width: '100vw',zIndex: 99999, height: '100vh', top: 0, left: 0, position: 'fixed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `rgba(0,0,0,${style.opacity})`}}>
            <View style={{width: '70%', position: 'relative', opacity: 1}}>
                <Image mode={'widthFix'} src={utils.resolveUrl(showItem.image)} style={{width: '100%', display: 'block'}} onClick={navigateToCouponDetail} />
                <View style={{marginTop: Taro.pxTransform(20), textAlign: 'center', color: 'white', fontSize: Taro.pxTransform(24), cursor: 'pointer'}}>
                    <Text className="text-white" onClick={closeAdv}>关闭</Text>
                </View>
            </View>
        </View>
    );
};

export default PopAdvertise;
