import { AttributeTabs, registerModule } from "../../component"
import image from 'assets/designer/s2_3.png';
import { useEffect } from "react";
import { resolveUrl } from "~/utils/utils";
import BoxSettings, { DEFAULT_BOX_STYLES } from "../BoxSettings";
import FallbackImage from "~/components/fallback-image";


export const MULTIPLE_IMAGES_MODULE = "MULTIPLE_IMAGES_MODULE";
export const defaultData = {
    basic: {
        style: 1,
        space: 10,
        image1: '',
        url1: '',
        image2: '',
        url2: '',
        image3: '',
        url3: '',
    },
    style: {
        ...DEFAULT_BOX_STYLES,
    }
};

const MultipleImagesModuleAttribute = (props: any) => {
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

const MultipleImagesModule = (props: any) => {
    const { index, data,isPreview, ...rest } = props;
    let _data = { ...defaultData, ...data };

    return (
        <div {...rest} style={_data.style}>
            <div {...rest} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{ flex: 1, marginRight: _data.basic.space}}>
                    <FallbackImage src={resolveUrl(_data.basic.image1)} style={{width: '100%'}} width='100%' />
                </div>
                <div style={{ flex: 1}}>
                    <FallbackImage src={resolveUrl(_data.basic.image2)} style={{width: '100%'}} width='100%' />
                </div>
            </div>
            {_data.basic.style == 2 && <>
                <div style={{ width: '100%', marginTop: _data.basic.space}}>
                    <FallbackImage src={resolveUrl(_data.basic.image3)} style={{width: '100%'}} width='100%' />
                </div>
            </>}
        </div>
    );
}



export default function () {
    registerModule(MULTIPLE_IMAGES_MODULE, "多图", image, '公共模块', MultipleImagesModule, MultipleImagesModuleAttribute, defaultData);
}