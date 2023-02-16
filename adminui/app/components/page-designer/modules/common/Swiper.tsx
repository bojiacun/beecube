import { AttributeTabs, registerModule } from "../../component"
import image from 'assets/designer/swiper.png';
import { useEffect, useRef } from "react";
import { resolveUrl } from "~/utils/utils";
import BoxSettings, { DEFAULT_BOX_STYLES } from "../BoxSettings";
import Swiper, { SwipeRef } from 'react-tiga-swiper';
import 'react-tiga-swiper/dist/index.css';
import FallbackImage from "~/components/fallback-image";


export const SWIPER_MODULE = "SWIPER_MODULE";
export const defaultData = {
    basic: {
        height: 350,
        images: [
            { image: '', url: '', text: '轮播图1' },
            { image: '', url: '', text: '轮播图2' },
        ],
        mode: 'aspectFit',
    },
    style: {
        ...DEFAULT_BOX_STYLES,
    }
};

const SwiperModuleAttribute = (props: any) => {
    const { onUpdate, data } = props;

    let _data = { ...defaultData, ...data };

    return (
        <AttributeTabs tabs={['控件设置', '样式设置']}>
            <div style={{ padding: 15 }}>

            </div>
            <div style={{ padding: 15 }}>

            </div>
        </AttributeTabs>
    );
}

const SwiperModule = (props: any) => {
    const { index, data, isPreview, ...rest } = props;
    let _data = { ...defaultData, ...data };
    const swiperRef = useRef<SwipeRef>(null);

    return (
        <div {...rest} style={_data.style}>
            <Swiper ref={swiperRef}>
                {_data.basic.images.map((item: any) => {
                    return <FallbackImage key={item.image+isPreview} src={resolveUrl(item.image)} style={{ width: '100%', objectFit: 'cover' }} width={'100%'} />;
                })}
            </Swiper>
        </div>
    );
}



export default function () {
    registerModule(SWIPER_MODULE, "轮播图", image, '公共模块', SwiperModule, SwiperModuleAttribute, defaultData);
}