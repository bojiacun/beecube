import {FC, useState} from "react";
import styles from './index.module.scss';
import 'react-tabs/style/react-tabs.css';
import {Text, View} from "@tarojs/components";
import classNames from "classnames";

export interface ListViewTabItem {
    label: string;
    id: string|number;
    selected?: boolean;
}

export interface ListViewProps extends Partial<any>{
    tabs: ListViewTabItem[];
    onTabChanged?: Function;
}

const ListView : FC<ListViewProps> = (props) => {
    const {children, tabs, onTabChanged = ()=>{}} = props;
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    return (
        <>
            <View className={'bg-white px-4 py-3 flex items-center justify-between space-x-2 text-gray-700'} style={{overflowY: 'hidden', overflowX: 'auto'}}>
                {tabs.map((tab, index) => {
                    return (
                        <Text className={classNames(index === selectedIndex ? styles.active:'')} onClick={()=>{
                            setSelectedIndex(index);
                            onTabChanged(tab, index);
                        }}>
                            {tab.label}
                        </Text>
                    );
                })}
            </View>
            {children}
        </>
    );
}

export default ListView;
