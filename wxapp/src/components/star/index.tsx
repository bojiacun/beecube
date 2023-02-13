import React, {useState} from "react";
import {View, Image, Text} from '@tarojs/components';

interface StarProps {
    length?: number;
    min?: number;
    iconPath?: string;
    selectedIconPath?: string;
    title: string;
    onValueChange: (value:number) => void;
    initValue?: number;
}


const Star: React.FC<StarProps> = (props) => {
    const {
        length = 5,
        min = 1,
        iconPath = '../../assets/images/star.png',
        selectedIconPath = '../../assets/images/star-active.png',
        title,
        onValueChange,
        initValue = 5
    } = props;
    const [value, setValue] = useState<number>(initValue);


    const items:number[] = [];
    for (let i = 0; i < length; i++) {
        items.push(i);
    }

    const handleStarClick = (index) => {
        if(index < min - 1) {
            setValue(min);
        }
        else {
            setValue(index+1);
        }
        onValueChange(index+1);
    }

    return (
        <View className="flex align-center">
            <Text className="margin-right">{title}</Text>
            {items.map((i:number) => {
                return ((i < value) ?
                    <Image style={{width: '48rpx', height: '48rpx'}} onClick={()=>handleStarClick(i)} className={"margin-right-sm"} src={selectedIconPath} /> :
                    <Image style={{width: '48rpx', height: '48rpx'}} onClick={()=>handleStarClick(i)} className={"margin-right-sm"} src={iconPath} />)
            })}
        </View>
    );
}

export default Star;
