import {FC, ReactElement, useEffect, useState} from "react";
import styles from './index.module.scss';
import 'react-tabs/style/react-tabs.css';
import {Text, View} from "@tarojs/components";
import classNames from "classnames";
import {usePullDownRefresh, useReachBottom} from "@tarojs/taro";
import utils from "../../lib/utils";
import stylesFlow from '../../flow.module.scss';

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
    tabJustify?: 'justify-between'|'justify-start'
}

const FlowListView: FC<ListViewProps> = (props) => {
    const {
        tabs, onTabChanged = () => {}, dataFetcher,
        tabJustify = 'justify-start'
    } = props;
    const initDatas = tabs.map(() => []);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [datas, setDatas] = useState<any[]>(initDatas);
    const [page, setPage] = useState<number>(1);

    useEffect(()=>{
        if(tabs && tabs.length > 0) {
            utils.showLoading();
            dataFetcher(1, tabs[0], 0).then(res => {
                datas[selectedIndex] = res.data.result.records;
                setDatas([...datas]);
                utils.hideLoading();
            }).catch(() => utils.hideLoading());
        }
    }, [tabs]);

    //下拉刷新
    usePullDownRefresh(() => {
        dataFetcher(1, tabs[selectedIndex], selectedIndex).then(res => {
            datas[selectedIndex] = res.data.result.records;
            setDatas([...datas]);
        });
        setPage(1);
    });

    //下拉加载
    useReachBottom(() => {
        dataFetcher(page + 1, tabs[selectedIndex], selectedIndex).then(res => {
            datas[selectedIndex].pushAll(res.data.result.records);
            setDatas([...datas]);
        })
        setPage(page + 1);
    });


    return (
        <>
            {tabs.length > 0 && <View className={classNames('bg-white px-4 py-3 flex items-center space-x-4 text-gray-700', tabJustify)}
                  style={{overflowY: 'hidden', overflowX: 'auto'}}>
                {tabs.map((tab, index) => {
                    return (
                        <Text className={classNames(index === selectedIndex ? styles.active : '')} onClick={() => {
                            utils.showLoading();
                            onTabChanged(tab, index);
                            dataFetcher(1, tab, index).then(res => {
                                datas[index] = res.data.result.records;
                                setDatas([...datas]);
                                setSelectedIndex(index);
                                setPage(1);
                                utils.hideLoading();
                            });
                        }}>
                            {tab.label}
                        </Text>
                    );
                })}
            </View>}
            {tabs.map((tab, index) => {
                let data = datas[index] || [];
                if (data.length == 0) {
                    return (
                        <View style={{display: selectedIndex === index ? 'block': 'none'}} className={'text-center mt-20 text-gray-300'}>
                            <View className={'iconfont icon-zanwushuju text-9xl'} />
                            <View>暂无数据</View>
                        </View>
                    );
                }
                return (
                    <View className={classNames('p-4', stylesFlow.flowWrapper)} style={{display: selectedIndex === index ? '': 'none'}}>
                        {data.map((item:any)=>tab.template(item))}
                    </View>
                );
            })}
        </>
    );
}

export default FlowListView;
