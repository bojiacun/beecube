import {FC, ReactElement, useState} from "react";
import styles from './index.module.scss';
import 'react-tabs/style/react-tabs.css';
import {Text, View} from "@tarojs/components";
import classNames from "classnames";
import {usePullDownRefresh, useReachBottom} from "@tarojs/taro";
import NoData from "../nodata";

export interface ListViewTabItem {
    label: string;
    id: string | number;
    selected?: boolean;
    template: (data: any) => ReactElement;
}

export interface ListViewProps extends Partial<any> {
    tabs: ListViewTabItem[];
    onTabChanged?: Function;
    dataFetcher: (pageIndex: number, tab: ListViewTabItem, index: number) => Promise<any>;
}

const ListView: FC<ListViewProps> = (props) => {
    const {
        tabs, onTabChanged = () => {
        }, dataFetcher
    } = props;
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);


    //下拉刷新
    usePullDownRefresh(() => {
        dataFetcher(1, tabs[selectedIndex], selectedIndex).then(res => {
            setData([...res.data.result.records]);
        });
        setPage(1);
    });

    //下拉加载
    useReachBottom(() => {
        dataFetcher(page + 1, tabs[selectedIndex], selectedIndex).then(res => {
            data.push(res.data.result.records);
            setData([...data]);
        })
        setPage(page + 1);
    });


    return (
        <>
            <View className={'bg-white px-4 py-3 flex items-center justify-between space-x-2 text-gray-700'}
                  style={{overflowY: 'hidden', overflowX: 'auto'}}>
                {tabs.map((tab, index) => {
                    return (
                        <Text className={classNames(index === selectedIndex ? styles.active : '')} onClick={() => {
                            setSelectedIndex(index);
                            onTabChanged(tab, index);
                            setPage(1);
                            dataFetcher(1, tab, index).then(res => {
                                setData(res.data.result.records);
                            });
                        }}>
                            {tab.label}
                        </Text>
                    );
                })}
            </View>
            {data.length === 0 && <NoData />}
            {data.map((item) => {
                let tab = tabs[selectedIndex];
                return (
                    <View>
                        {tab.template(item)}
                    </View>
                );
            })}
        </>
    );
}

export default ListView;
