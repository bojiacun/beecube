import {View} from "@tarojs/components";
import React, {FC} from "react";
import Taro from "@tarojs/taro";
import classNames from "classnames";

export interface TransparentTagProps {
    padding?: number | string;
    round?: boolean;
    opacity?: number;
    className?: string;
    style?: any;
    children: any;
    animation?: any;
    id?:any;
}

const TransparentTag: FC<TransparentTagProps> = (props) => {
    const {padding = Taro.pxTransform(5), round = true, className, style, opacity = 0.4, children, animation, id} = props;
    children.props.style = children.props.style ? children.props.style : {};
    const Child = React.cloneElement(children, {
        style: {
            zIndex: 999,
            position: 'relative',
            color: 'white',
            whiteSpace: 'break-spaces',
            wordBreak: 'break-word',
            wordWrap: 'break-word',
            ...children.props.style
        }
    });
    return (
        <View id={id} animation={animation} className={classNames(className, round ? 'round' : '')} style={{
            lineHeight: 1.5,
            overflow: 'hidden',
            padding: padding,
            display: 'inline-flex',
            position: 'relative', ...style
        }}>
            <View className={'bg-black'} style={{
                opacity: opacity,
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 0
            }}/>
            {Child}
        </View>
    );
}

export default TransparentTag;
