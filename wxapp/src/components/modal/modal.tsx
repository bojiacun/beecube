import {Text, View} from "@tarojs/components";
import classNames from "classnames";
import Taro from "@tarojs/taro";


const Modal = props => {
    const {visible = false, onClose = ()=>{}, children, bottom = true, showCloseButton = true, backgroundColor = null, height = 250} = props;

    const style:any = {};
    if(backgroundColor) {
        style.backgroundColor = backgroundColor;
    }
    style.height = Taro.pxTransform(height);

    return (
        <>
            <View className={classNames("cu-modal", bottom ? "bottom-modal":"", visible ? 'show':'')} onClick={onClose}>
                <View className='cu-dialog shadow bg-white' onClick={event => event.stopPropagation()} style={style}>
                    {showCloseButton && <Text className="cuIcon-close" onClick={onClose} />}
                    {children}
                </View>
            </View>
        </>
    );
}


export default Modal
