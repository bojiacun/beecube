import {FC, useState} from "react";
import styles from './index.module.scss';
import 'react-tabs/style/react-tabs.css';
import {Text, View} from "@tarojs/components";
import classNames from "classnames";
import {usePullDownRefresh} from "@tarojs/taro";

export interface ListViewTabItem {
    label: string;
    id: string|number;
    selected?: boolean;
}

export interface ListViewProps extends Partial<any>{
    tabs: ListViewTabItem[];
    onTabChanged?: Function;
    dataFetcher: (pageIndex: number, tab: ListViewTabItem, index: number) => Promise<any>;
}

const ListView : FC<ListViewProps> = (props) => {
    const {children, tabs, onTabChanged = ()=>{}, dataFetcher} = props;
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [datas, setDatas] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);


    usePullDownRefresh(()=>{});

    return (
        <>
            <View className={'bg-white px-4 py-3 flex items-center justify-between space-x-2 text-gray-700'} style={{overflowY: 'hidden', overflowX: 'auto'}}>
                {tabs.map((tab, index) => {
                    return (
                        <Text className={classNames(index === selectedIndex ? styles.active:'')} onClick={()=>{
                            setSelectedIndex(index);
                            onTabChanged(tab, index);
                            setPage(1);
                            dataFetcher(1,tab, index).then(res=>{
                                setDatas(res.data.result);
                            });
                        }}>
                            {tab.label}
                        </Text>
                    );
                })}
            </View>

        </>
    );
}

export default ListView;
