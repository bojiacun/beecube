import {FC, ReactElement, useEffect, useState} from "react";
import styles from './index.module.scss';
import 'react-tabs/style/react-tabs.css';
import {Text, View} from "@tarojs/components";
import classNames from "classnames";
import Taro, {usePullDownRefresh, useReachBottom} from "@tarojs/taro";
import NoData from "../nodata";
import LoadMore from "../loadmore";
import utils from "../../lib/utils";

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
    tabStyle?: number;
    defaultActiveKey?: string|number|null;
}

const ListView: FC<ListViewProps> = (props) => {
    const {
        tabs,
        onTabChanged = () => { },
        dataFetcher,
        tabStyle = 1,
        defaultActiveKey = null
    } = props;
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [noMore, setNoMore] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);


    useEffect(()=>{
        if(tabs && tabs.length > 0) {
            utils.showLoading();
            let defaultTab = tabs[0];
            let initIndex = 0;
            if(defaultActiveKey != null) {
                tabs.forEach((t,index) => {
                    if(t.id === defaultActiveKey) {
                        initIndex = index;
                        setSelectedIndex(initIndex);
                        defaultTab = t;
                    }
                })
            }
            dataFetcher(1, defaultTab, initIndex).then(res => {
                setData([...res.data.result.records]);
                utils.hideLoading();
            }).catch(() => utils.hideLoading());
        }
    }, [tabs]);

    //下拉刷新
    usePullDownRefresh(() => {
        dataFetcher(1, tabs[selectedIndex], selectedIndex).then(res => {
            setData([...res.data.result.records]);
        });
        setPage(1);
    });

    //下拉加载
    useReachBottom(() => {
        setLoadingMore(true);
        dataFetcher(page + 1, tabs[selectedIndex], selectedIndex).then(res => {
            let records = res.data.result.records;
            if(records.length == 0) {
                setNoMore(true);
            }
            else {
                setData([...data, ...records]);
            }
            setLoadingMore(false);
        })
        setPage(page + 1);
    });


    return (
        <>
            <View className={classNames('bg-white px-4 py-3 flex fixed items-center w-full space-x-4 text-gray-700')}
                  style={{overflowY: 'hidden', overflowX: 'auto', zIndex: 9999}}>
                {tabs.map((tab, index) => {
                    return (
                        <Text className={classNames(tabStyle == 1? '':'flex-1','text-center',index === selectedIndex ? styles.active : '')} onClick={() => {
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
            {data.length === 0 && <NoData style={{marginTop: 200}} />}
            <View className={'p-4 space-y-4'} style={{paddingTop: Taro.pxTransform(70)}}>
            {data.map((item) => {
                let tab = tabs[selectedIndex];
                return tab.template(item);
            })}
            </View>
            {data.length > 0 && <LoadMore noMore={noMore} loading={loadingMore} />}
        </>
    );
}

export default ListView;
