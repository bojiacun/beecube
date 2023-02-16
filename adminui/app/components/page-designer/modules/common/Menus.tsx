import { AttributeTabs, registerModule } from "../../component"
import image from 'assets/designer/s1_1.png';
import { useEffect } from "react";

import BoxSettings, { DEFAULT_BOX_STYLES } from "../BoxSettings";
import FallbackImage from "~/components/fallback-image";
import { resolveUrl } from "~/utils/utils";


export const MENUS_MODULE = "MENUS_MODULE";

export const defaultData = {
    basic: {
        columns: 4,
        title: '导航标题',
        showTitle: false,
        menus: [
            { image: '', url: '', text: '菜单1' },
            { image: '', url: '', text: '菜单2' },
            { image: '', url: '', text: '菜单3' },
            { image: '', url: '', text: '菜单4' },
        ],
    },
    style: {
        ...DEFAULT_BOX_STYLES,
    },
    imageStyle: {
        width: 48,
        height: 48,
        marginBottom: 0,
    }
};

const MenusModuleAttribute = (props: any) => {
    const { onUpdate, data } = props;

    let _data = { ...defaultData, ...data };


    return (
        <AttributeTabs tabs={['控件设置', '样式设置']}>
            <div style={{ padding: 15 }}>

            </div>

        </AttributeTabs>
    );
}

const MenusModule = (props: any) => {
    const { index, data,isPreview, ...rest } = props;
    let _data = { ...defaultData, ...data };

    return (
        <div {...rest} style={_data.style}>
            {_data.basic.showTitle && <div style={{paddingLeft: 15, borderBottom: '1px solid #f5f5f5', marginBottom: 10}}>
                <h3>{_data.basic.title}</h3>
            </div>}
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
                {_data.basic.menus.map((item: any, i:number) => {
                    return (
                        <div key={'menus'+index+''+i} style={{ width: 100 / parseInt(_data.basic.columns) + '%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <FallbackImage style={{..._data.imageStyle}} src={resolveUrl(item.image)} />
                            <div>{item.text}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}



export default function () {
    registerModule(MENUS_MODULE, "导航菜单", image, '公共模块', MenusModule, MenusModuleAttribute, defaultData);
}