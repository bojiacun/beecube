import {FC, ReactElement, useEffect, useState} from "react";
import styles from './index.module.scss';
import 'react-tabs/style/react-tabs.css';
import {Text, View, ScrollView} from "@tarojs/components";
import classNames from "classnames";
import {useDidShow, usePullDownRefresh, useReachBottom} from "@tarojs/taro";
import utils from "../../lib/utils";
import stylesFlow from '../../flow.module.scss';
import LoadMore from "../loadmore";
import NoData from "../nodata";
import {useSelector} from "react-redux";

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
    autoRefresh?: boolean;
    fixed?:boolean;
    tabClassName?: string;
    className?: string;
}

const FlowListView: FC<ListViewProps> = (props) => {
    const {
        tabs, onTabChanged = () => {}, dataFetcher,
        tabStyle = 1,
        defaultActiveKey = null,
        className= '',
        tabClassName = 'bg-white',
        autoRefresh = false,
        fixed = true,
    } = props;
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [noMore, setNoMore] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const message = useSelector((state:any) => state.message);
    const systemInfo = useSelector(({context}) => context.systemInfo);
    useEffect(()=>{
        if(message) {
            data.forEach(g => {
                if (g.id == message.performanceId) {
                    switch (message.type) {
                        case 'MSG_TYPE_PEFORMANCE_STARTED':
                            g.state = message.state;
                            g.startTime = message.startTime;
                            break;
                        case 'MSG_TYPE_PEFORMANCE_ENDED':
                            g.state = message.state;
                            g.endTime = message.endTime;
                            break;
                        case 'MSG_TYPE_PEFORMANCE_CHANGED':
                            g.startTime = message.startTime;
                            g.endTime = message.endTime;
                            break;
                    }
                }
                if (g.id == message.goodsId) {
                    switch (message.type) {
                        case 'MSG_TYPE_AUCTION_STARTED':
                            g.state = message.state;
                            g.startTime = message.startTime;
                            break;
                        case 'MSG_TYPE_AUCTION_ENDED':
                            g.state = message.state;
                            g.endTime = message.endTime;
                            break;
                        case 'MSG_TYPE_AUCTION_CHANGED':
                            g.startTime = message.startTime;
                            g.endTime = message.endTime;
                            g.actualEndTime = message.actualEndTime;
                            break;
                    }
                }
            });
            setData([...data]);
        }
    }, [message]);
    useEffect(()=>{
        if(tabs && tabs.length > 0) {
            utils.showLoading();
            let defaultTab = tabs[0];
            let initIndex = 0;
            if(defaultActiveKey != null) {
                tabs.forEach((t,index) => {
                    if(t.id === defaultActiveKey) {
                        initIndex = index;
                        defaultTab = t;
                    }
                })
            }
            setSelectedIndex(initIndex);
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
    useDidShow(() => {
        if(autoRefresh && selectedIndex > -1) {
            //列表显示的时候主动刷新
            dataFetcher(1, tabs[selectedIndex], selectedIndex).then(res => {
                setData([...res.data.result.records]);
            });
            setPage(1);
        }
    });
    let tabStyles:any = {
        overflowY: 'hidden', overflowX: 'auto', zIndex: 99
    }
    if(fixed) {
        tabStyles.top = utils.calcPageHeaderHeight(systemInfo)
    }
    return (
        <>
            {tabStyle == 1 && tabs.length > 0 && <ScrollView scrollY={false} scrollX={true} type={'list'} className={classNames('box-border whitespace-nowrap flex items-center px-4 py-2 text-gray-700',fixed?'sticky':'', tabClassName)}
                  style={tabStyles}>
                {tabs.map((tab, index) => {
                    return (
                        <Text className={classNames(tabStyle == 1 ? '':'flex-1','text-center mr-4',index === selectedIndex ? styles.active : '')} onClick={() => {
                            utils.showLoading();
                            onTabChanged(tab, index);
                            dataFetcher(1, tab, index).then(res => {
                                setData([...res.data.result.records]);
                                setSelectedIndex(index);
                                setPage(1);
                                setNoMore(false);
                                setLoadingMore(false);
                                utils.hideLoading();
                            });
                        }}>
                            {tab.label}
                        </Text>
                    );
                })}
            </ScrollView>}
            {tabStyle == 2 && tabs.length > 0 && <View className={classNames('bg-white box-border whitespace-nowrap flex items-center px-4 py-2 text-gray-700',fixed?'sticky':'')}
                                                             style={tabStyles}>
                {tabs.map((tab, index) => {
                    return (
                        <Text className={classNames('text-center flex-1',index === selectedIndex ? styles.active : '')} onClick={() => {
                            utils.showLoading();
                            onTabChanged(tab, index);
                            dataFetcher(1, tab, index).then(res => {
                                setData([...res.data.result.records]);
                                setSelectedIndex(index);
                                setPage(1);
                                setNoMore(false);
                                setLoadingMore(false);
                                utils.hideLoading();
                            });
                        }}>
                            {tab.label}
                        </Text>
                    );
                })}
            </View>}
            {data.length === 0 && <NoData style={{marginTop: 200}} />}
            {data.length > 0 &&
                <View className={classNames('p-4', stylesFlow.flowWrapper, className)}>
            {selectedIndex > -1 && data.map((item) => {
                let tab = tabs[selectedIndex];
                return tab.template(item);
            })}
            </View>}
            {data.length > 0 && <LoadMore noMore={noMore} loading={loadingMore} />}
            <View style={{height: 100}} />
        </>
    );
}

export default FlowListView;
