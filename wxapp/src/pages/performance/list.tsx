import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import ListView, {ListViewTabItem} from "../../components/listview";
import {Navigator, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import TimeCountDowner, {TimeCountDownerMode} from "../../components/TimeCountDowner";
import request from "../../lib/request";
import PageLoading from "../../components/pageloading";
import listStyle from './list.module.scss';
import classNames from "classnames";


export default class Index extends Component<any, any> {
    state:any = {
        options: null
    }
    tabs: ListViewTabItem[];

    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.renderTemplate = this.renderTemplate.bind(this);
        this.tabs = [
            {
                label: '竞拍中',
                id: 1,
                template: this.renderTemplate
            },
            {
                label: '已结束',
                id: 2,
                template: this.renderTemplate
            },
        ];
    }


    loadData(page: number, tab: ListViewTabItem) {
        return request.get('/paimai/api/performances/list', {params: {tag: this.state.tag, source: tab.id, pageNo: page}});
    }

    renderTemplate(data) {
        let radius = 0;
        if(data.type == 1) {
            return (
                <View className={'bg-white relative overflow-hidden shadow-outer'} style={{borderRadius: Taro.pxTransform(radius)}}>
                    <Navigator url={'/pages/performance/detail?id=' + data.id}>
                        <View className={'relative'} style={{width: '100%'}}>
                            <FallbackImage mode={'widthFix'}
                                           className={'block w-full'} src={utils.resolveUrl(data.preview)}/>
                            <View className={listStyle.wrap}><Text className={classNames(listStyle.silkRibbon6, 'text-white text-sm bg-red-400')}>限时拍</Text></View>
                        </View>
                        <View className={'p-4 space-y-2 divide-y divide-gray-100'}>
                            <View className={'space-y-1'}>
                                <View className={'font-bold text-lg'}>
                                    {data.title}
                                </View>
                                <TimeCountDowner
                                    className={'flex text-sm'}
                                    endTime={data.endTime}
                                    startTime={data.startTime}
                                />
                            </View>
                            <View className={'flex space-x-4 pt-2'}>
                                <Text>报名{data.depositCount}人</Text>
                                <Text>围观{data.viewCount}人</Text>
                                <Text>出价{data.offerCount}次</Text>
                            </View>
                        </View>
                    </Navigator>
                </View>
            );
        }
        else {
            return (
                <View className={'bg-white relative overflow-hidden shadow-outer'} style={{borderRadius: Taro.pxTransform(radius)}}>
                    <Navigator url={'/pages/performance/detail2?id=' + data.id}>
                        <View className={'relative'} style={{width: '100%'}}>
                            <FallbackImage mode={'widthFix'}
                                           className={'block w-full'} src={utils.resolveUrl(data.preview)}/>
                            <View className={listStyle.wrap}><Text className={classNames(listStyle.silkRibbon6, 'text-white text-sm bg-indigo-600')}>同步拍</Text></View>
                        </View>
                        <View className={'p-4 space-y-2 divide-y divide-gray-100'}>
                            <View className={'space-y-1'}>
                                <View className={'font-bold text-lg'}>
                                    {data.title}
                                </View>
                                {data.state == 0 && data.startTime != null &&
                                    <TimeCountDowner
                                        mode={TimeCountDownerMode.Manual}
                                        className={'flex text-sm'}
                                        startTime={data.startTime}
                                        started={data.state == 1}
                                        ended={data.state == 2}
                                    />
                                }
                            </View>
                            <View className={'flex pt-2 space-x-4'}>
                                <Text>报名{data.depositCount}人</Text>
                                <Text>围观{data.viewCount}人</Text>
                                <Text>出价{data.offerCount}次</Text>
                            </View>
                        </View>
                    </Navigator>
                </View>
            );
        }
    }

    onLoad(options) {
        if(options.tag) {
            this.setState({options: options});
        }
        else {
            this.setState({options: {tag: '所有专场'}});
        }
    }

    render() {
        if(!this.state.options) return <PageLoading />;

        return (
            <PageLayout statusBarProps={{title: decodeURIComponent(this.state.options.tag)}} enableReachBottom={true} showTabBar={true}>
                <ListView tabs={this.tabs} dataFetcher={this.loadData}  defaultActiveKey={this.state.options.source} tabStyle={2} />
            </PageLayout>
        );
    }
}
