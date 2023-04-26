import {FC, ReactElement, useEffect, useState} from "react";
import styles from './index.module.scss';
import 'react-tabs/style/react-tabs.css';
import {Text, View, ScrollView} from "@tarojs/components";
import classNames from "classnames";
import {useDidShow, usePullDownRefresh, useReachBottom} from "@tarojs/taro";
import NoData from "../nodata";
import LoadMore from "../loadmore";
import utils from "../../lib/utils";
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
    defaultActiveKey?: string | number | null;
    autoRefresh?: boolean;
    fixed?:boolean;
}

const ListView: FC<ListViewProps> = (props) => {
    const {
        tabs,
        onTabChanged = () => {
        },
        dataFetcher,
        tabStyle = 1,
        defaultActiveKey = null,
        className,
        autoRefresh = false,
        fixed = true,
    } = props;
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [noMore, setNoMore] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const systemInfo = useSelector(({context}) => context.systemInfo);


    useEffect(() => {
        if (tabs && tabs.length > 0) {
            utils.showLoading();
            let defaultTab = tabs[0];
            let initIndex = 0;
            if (defaultActiveKey !== null) {
                tabs.forEach((t, index) => {
                    if (t.id == defaultActiveKey) {
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
            if (records.length == 0) {
                setNoMore(true);
            } else {
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
        overflowY: 'hidden', overflowX: 'auto', zIndex: 9999
    }
    if(fixed) {
        tabStyles.top = utils.calcPageHeaderHeight(systemInfo)
    }

    return (
        <>
            {tabStyle == 1 &&
                <ScrollView
                    scrollX={true}
                    scrollY={false}
                    className={classNames('bg-white box-border whitespace-nowrap flex items-center px-4 py-2 text-gray-700', fixed ? 'sticky' : '')}
                    style={tabStyles} type={'list'}>
                    {tabs.map((tab, index) => {
                        return (
                            <Text
                                className={classNames('text-center mr-4', index === selectedIndex ? styles.active : '')}
                                onClick={() => {
                                    setSelectedIndex(index);
                                    onTabChanged(tab, index);
                                    setPage(1);
                                    dataFetcher(1, tab, index).then(res => {
                                        setData(res.data.result.records);
                                        setNoMore(false);
                                        setLoadingMore(false);
                                    });
                                }}>
                                {tab.label}
                            </Text>
                        );
                    })}
                </ScrollView>
            }
            {tabStyle == 2 &&
                <View
                    className={classNames('bg-white box-border whitespace-nowrap flex items-center px-4 py-2 text-gray-700 w-full', fixed ? 'sticky' : '')}
                    style={tabStyles}
                >
                    {tabs.map((tab, index) => {
                        return (
                            <Text
                                className={classNames('text-center flex-1', index === selectedIndex ? styles.active : '')}
                                onClick={() => {
                                    setSelectedIndex(index);
                                    onTabChanged(tab, index);
                                    setPage(1);
                                    dataFetcher(1, tab, index).then(res => {
                                        setData(res.data.result.records);
                                        setNoMore(false);
                                        setLoadingMore(false);
                                    });
                                }}>
                                {tab.label}
                            </Text>
                        );
                    })}
                </View>
            }
            {data.length === 0 && <NoData style={{marginTop: 200}}/>}
            <View className={classNames('', className ? className : 'p-4 space-y-4')}>
                {selectedIndex > - 1 && data.map((item) => {
                    let tab = tabs[selectedIndex];
                    return tab.template(item);
                })}
            </View>
            {data.length > 0 && <LoadMore noMore={noMore} loading={loadingMore} />}
            <View style={{height: 100}}/>
        </>
    );
}

export default ListView;
