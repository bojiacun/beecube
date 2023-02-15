import React, {useEffect, useState} from "react";
import { AttributeTabs, registerControl } from "../component";
import {XCircle} from "react-feather";
import {resolveUrl} from "~/utils/utils";

export const POP_ADVERTISE = "POP_ADVERTISE";

export const defaultData = {
    basic: {
        image: '',
        link: '',
    },
    style: {
        opacity: 0.7,
    }
};

const PopAdvertiseAttributeView : React.FC<any> = (props) => {
    const { onUpdate, data } = props;

    let _data = { ...defaultData, ...data };

    useEffect(() => {
        onUpdate({ ..._data });
    }, []);
    return (
        <AttributeTabs tabs={['控件设置', '样式设置']}>
            <div style={{ padding: 15 }}>

            </div>
            <div style={{ padding: 15 }}>

            </div>
        </AttributeTabs>
    );
}
const PopAdvertise = (props: any) => {
    const { data, isPreview, ...rest } = props;
    const [hide, setHide] = useState<boolean>(false);
    let _data = { ...defaultData, ...data };

    const closeAdv = () => {
        console.log('close adv');
        setHide(true);
    }

    if(hide) {
        return <></>;
    }

    return (
        <div {...rest}  style={{width: '100%', height: '100%', top: 0, left: 0, position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `rgba(0,0,0,${_data.style.opacity})`}}>
            <div style={{width: '50%', position: 'relative', opacity: 1}}>
                <img alt={'pop_advertise'} src={resolveUrl(_data.basic.image)} style={{width: '100%', display: 'block'}} />
                <div style={{marginTop: 20, textAlign: 'center', color: 'white', fontSize: 24, cursor: 'pointer'}}><XCircle size={14} onPointerDown={closeAdv} /></div>
            </div>
        </div>
    );
};


export default function () {
    registerControl(POP_ADVERTISE, false, "弹窗广告", PopAdvertise, PopAdvertiseAttributeView, defaultData);
}

