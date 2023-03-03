import {Text, View} from "@tarojs/components";
import {FC, useEffect, useState} from "react";
import classNames from "classnames";

export interface ModalProps extends Partial<any> {
    showMask?: boolean;
    show?: boolean;
}

const Modal : FC<ModalProps> = (props) => {
    const {showMask = false, show = false, children} = props;
    const [isShow, setIsShow] = useState<boolean>(show);

    useEffect(()=>{
        setIsShow(show);
    }, [show]);

    const hideModal = () => {
        setIsShow(false);
    }

    return (
        <View className={classNames('flex flex-col items-center jusitify-center absolute bg-black w-screen h-screen', isShow? 'block': 'hidden', showMask ? 'bg-opacity-10':'bg-opacity-0')} style={{zIndex: 999999, left:0, top:0}}>
            <View className={'p-4 bg-white rounded-xl shadow-outer m-auto relative'} style={{width: '80%', maxHeight: '60%', overflowY: 'auto'}}>
                <Text className="far fa-regular fa-circle-xmark text-xl absolute cursor-pointer text-gray-500" style={{right: -10, top: -10}} onClick={hideModal} />
                {children}
            </View>
        </View>
    );
}

export default Modal
