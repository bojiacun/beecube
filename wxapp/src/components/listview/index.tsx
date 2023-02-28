import {FC, ReactElement, useState} from "react";
import styles from './index.module.scss';
import 'react-tabs/style/react-tabs.css';
import {Text, View} from "@tarojs/components";
import classNames from "classnames";
import {usePullDownRefresh, useReachBottom} from "@tarojs/taro";

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
    const initDatas = tabs.map(() => []);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [datas, setDatas] = useState<any[]>(initDatas);
    const [page, setPage] = useState<number>(1);


    //下拉刷新
    usePullDownRefresh(() => {
        dataFetcher(1, tabs[selectedIndex], selectedIndex).then(res => {
            datas[selectedIndex] = res.data.result;
            setDatas([...datas]);
        });
        setPage(1);
    });

    //下拉加载
    useReachBottom(() => {
        dataFetcher(page + 1, tabs[selectedIndex], selectedIndex).then(res => {
            datas[selectedIndex].pushAll(res.data.result);
            setDatas([...datas]);
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
                                datas[index] = res.data.result;
                                setDatas([...datas]);
                            });
                        }}>
                            {tab.label}
                        </Text>
                    );
                })}
            </View>
            {tabs.map((tab, index) => {
                let data = datas[index];
                if (data.length == 0) {
                    return (
                        <View style={{display: selectedIndex === index ? 'block': 'none'}} className={'text-center mt-20 text-gray-300'}>
                            <View className={'iconfont icon-zanwushuju text-9xl'} />
                            <View>暂无数据</View>
                        </View>
                    );
                }
                return (
                    <View style={{display: selectedIndex === index ? 'block': 'none'}}>
                        {tab.template(data)}
                    </View>
                );
            })}
        </>
    );
}

export default ListView;
