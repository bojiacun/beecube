import {Navigator, Text, View} from "@tarojs/components";
import {FC, PropsWithChildren, ReactElement, useState} from "react";
import Taro from "@tarojs/taro";
import classNames from "classnames";


export interface CollapseProps extends PropsWithChildren<any> {
    icon?: ReactElement;
    title?: string;
    description?: string;
    url?: string;
    showArrow?: boolean;
}

const Collapse: FC<CollapseProps> = (props) => {
    const {children, icon, title, description = '', url = '', showArrow = false} = props;
    const [childrenShow, setChildrenShow] = useState<boolean>(false);

    if (url != '') {
        return (
            <>
                <View className={'py-4'}>
                    <Navigator className={'flex'}>
                        <View className={'text-gray-400'} style={{width: Taro.pxTransform(icon ? 100 : 80)}}>
                            {icon}
                            <Text className={classNames(description == '' ? 'font-bold text-gray-800':'')}>{title}</Text>
                        </View>
                        <View className={'flex-1 flex items-center justify-between'}>
                            <View>{description}</View>
                            {showArrow && <Text className={classNames('iconfont icon-youjiantou_huaban text-gray-400')}/>}
                        </View>
                    </Navigator>
                </View>
            </>
        );
    }

    return (
        <>
            <View className={'py-4 flex'} onClick={()=>setChildrenShow(!childrenShow)}>
                <View className={'text-gray-400'} style={{width: Taro.pxTransform(icon ? 120 : 90)}}>
                    {icon}
                    <Text className={classNames(description == '' ? 'font-bold text-gray-800':'')}>{title}</Text>
                </View>
                <View className={'flex-1 flex items-center justify-between'}>
                    <View>{description}</View>
                    {showArrow && <Text className={classNames('iconfont icon-youjiantou_huaban text-gray-400')}/>}
                </View>
            </View>
            {childrenShow && <View className={'py-4'} style={{border: 'none'}}>
                {children}
            </View>}
        </>
    );
}


export default Collapse;
