import { AttributeTabs, registerModule } from "../../component"
import image from 'assets/designer/s3_2.png';
import biaoqian from 'assets/designer/biaoqian.png';
import { useEffect } from "react";
import { resolveUrl } from "~/utils/utils";
import BoxSettings, { DEFAULT_BOX_STYLES } from "../BoxSettings";
import FallbackImage from "~/components/fallback-image";


export const SINGLE_IMAGE_MODULE = "SINGLE_IMAGE_MODULE";
export const defaultData = {
    basic: {
        title: '单图标题',
        showTitle: false,
        image: '',
        url: '',
    },
    style: {
        ...DEFAULT_BOX_STYLES,
    }
};

const SingleImageModuleAttribute = (props: any) => {
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

const SingleImageModule = (props: any) => {
    const { index, data, isPreview, ...rest } = props;
    let _data = { ...defaultData, ...data };

    return (
        <div {...rest} style={_data.style}>
            {_data.basic.showTitle&&
            <div style={{
                position: 'relative',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <img src={biaoqian} alt={''} style={{ display: 'block', width: '50%', position: 'absolute', zIndex: 0 }} />
                <h1 style={{ zIndex: 1, fontSize: _data.basic.fontSize, marginBottom: 20 }}>{_data.basic.title}</h1>
            </div>
            }

            <FallbackImage src={resolveUrl(_data.basic.image)} style={{ width: '100%', objectFit: 'cover' }} width={'100%'}  />
        </div>
    );
}



export default function (){
    registerModule(SINGLE_IMAGE_MODULE, "单图", image, '公共模块', SingleImageModule, SingleImageModuleAttribute, defaultData);
}