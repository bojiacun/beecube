import classNames from "classnames";
import Taro from '@tarojs/taro';
import PropTypes from 'prop-types';
import utils from '../../lib/utils';
import {Image, Swiper, SwiperItem, View} from "@tarojs/components";
import {ImageProps} from "@tarojs/components/types/Image";
// @ts-ignore
import styles from './index.module.scss';

export declare interface CustomSwiperItem {
    id: number,
    url: string,
    image: string,
}

export declare interface CustomSwiperProps {
    dotStyle: number,
    list: CustomSwiperItem[],
    autoplay: boolean,
    interval: number,
    duration: number,
    indicatorDots: boolean,
    circular: boolean,
    imageMode: keyof ImageProps.Mode,
    indicatorColor: string,
    indicatorActiveColor: string,
    height: number,
    className: string,
    radius?: string,
    onItemClick?: (item:any)=>boolean;
}

const CustomSwiper = (props: CustomSwiperProps) => {
    const {
        dotStyle = true,
        list = [],
        autoplay = true,
        interval = 5000,
        duration = 500,
        indicatorDots = true,
        circular = true,
        imageMode = 'aspectFill',
        indicatorColor = 'white',
        indicatorActiveColor = 'white',
        height = 320,
        className = '',
        radius = '12rpx',
        onItemClick = () => false,
    } = props;

    return (
        <Swiper className={classNames("screen-swiper text-center", dotStyle ? "square-dot" : "round-dot", className)}
                style={{height: Taro.pxTransform(height), zIndex: 0}}
                indicatorDots={indicatorDots} circular={circular}
                autoplay={autoplay} interval={interval} duration={duration} indicatorColor={indicatorColor}
                indicatorActiveColor={indicatorActiveColor}>
            {
                list && list.map(item => {
                    return (
                        <SwiperItem key={item.id}>
                            <View style={{borderRadius: radius}} className={styles.img} onClick={()=>{
                                if(!onItemClick(item)){
                                    Taro.navigateTo({url: item.url}).then();
                                }
                            }}>
                                <Image src={utils.resolveUrl(item.image)} mode={imageMode} />
                            </View>
                        </SwiperItem>
                    );
                })
            }
        </Swiper>
    );
}

CustomSwiper.propTypes = {
    dotStyle: PropTypes.bool,
    list: PropTypes.array.isRequired,
    autoplay: PropTypes.bool,
    interval: PropTypes.number,
    duration: PropTypes.number,
    indicatorDots: PropTypes.bool,
    circular: PropTypes.bool,
    imageMode: PropTypes.string,
    indicatorColor: PropTypes.string,
    indicatorActiveColor: PropTypes.string,
    height: PropTypes.number,
    className: PropTypes.string,
    radius: PropTypes.string,
}
CustomSwiper.defaultProps = {
    dotStyle: true,
    autoplay: true,
    circular: true,
    imageMode: 'aspectFill',
    duration: 500,
    interval: 5000,
    indicatorDots: true,
    indicatorColor: 'white',
    indicatorActiveColor: 'white',
    height: 320,
    className: '',
    radius: '12rpx'
}

export default CustomSwiper
